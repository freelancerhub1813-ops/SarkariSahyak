const express = require('express');
try { require('dotenv').config(); } catch (e) { /* dotenv optional */ }
const cors = require('cors');
const mysql2 = require('mysql2');
const multer = require('multer');
let nodemailer = null;
try { nodemailer = require('nodemailer'); } catch (e) { console.warn('nodemailer not installed; email notifications disabled'); }
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static files serving for uploaded files
const FILES_ROOT = path.join(__dirname, 'files');
const PHOTOS_DIR = path.join(FILES_ROOT, 'documents', 'photos');
const DOCS_DIR = path.join(FILES_ROOT, 'documents', 'docs');
fs.mkdirSync(PHOTOS_DIR, { recursive: true });

// Email transporter (configure via environment variables)
let mailTransporter = null;
if (nodemailer) {
    mailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        } : undefined,
    });
}
fs.mkdirSync(DOCS_DIR, { recursive: true });
app.use('/files', express.static(FILES_ROOT));

// Multer storage per-user
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userEmail = req.body.user_email || req.query.user_email || '';
        const userName = req.body.user_name || req.query.user_name || (userEmail.includes('@') ? userEmail.split('@')[0] : 'unknown');
        const emailLocal = (userEmail && userEmail.includes('@')) ? userEmail.split('@')[0] : '';
        const safeUserFolder = (userName || 'unknown').toString().trim().replace(/[^a-zA-Z0-9._-]/g, '_');
        const safeEmailFolder = (emailLocal || '').toString().trim().replace(/[^a-zA-Z0-9._-]/g, '_');
        const type = req.uploadType === 'photo' ? PHOTOS_DIR : DOCS_DIR;
        // Nested path: /[photos|docs]/<userName>/<emailLocalPart>
        const dest = safeEmailFolder
          ? path.join(type, safeUserFolder, safeEmailFolder)
          : path.join(type, safeUserFolder);
        fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname) || '.bin';
        const userEmail = req.body.user_email || req.query.user_email || 'user';
        const namePart = (req.body.user_name || req.query.user_name || (userEmail.includes('@') ? userEmail.split('@')[0] : 'user'));
        const safeName = namePart.toString().trim().replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${safeName}_${timestamp}${ext}`);
    }
});

const upload = multer({ storage });

const con = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'sarkar_sahyka'
});

// Ensure missing tables exist (idempotent)
function ensureSchema() {
    const createSchemeQuestions = `
        CREATE TABLE IF NOT EXISTS scheme_questions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          scheme_id INT NOT NULL,
          sort_order INT NOT NULL DEFAULT 1,
          question_text VARCHAR(500) NOT NULL,
          expected_answer ENUM('yes','no') NOT NULL DEFAULT 'yes',
          next_on_yes INT NULL,
          next_on_no INT NULL,
          is_terminal_yes TINYINT(1) NOT NULL DEFAULT 0,
          is_terminal_no TINYINT(1) NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_q_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    con.query(createSchemeQuestions, (err) => {
        if (err) {
            console.error('Failed ensuring scheme_questions table:', err);
        } else {
            console.log('Ensured scheme_questions table exists');
        }
    });
}

// Idempotent user create (required for FK to work later)
app.post("/login", (req, res) => {
    let sql = "INSERT INTO users(uid,email) VALUES(?,?) ON DUPLICATE KEY UPDATE uid = VALUES(uid)";
    let data = [req.body.uid, req.body.email];
    con.query(sql, data, (error, result) => {  
        if (error) {
            console.error("DB error:", error);
            res.status(500).send("Database error");
            return;
        }
        res.send("User added");
    });
});

// Send notification email to applicant for application status
app.post('/notify-application/:id', (req, res) => {
    const appId = req.params.id;
    const sql = `SELECT 
        a.id, a.user_email, a.application_status, a.application_notes, a.applied_at, a.updated_at,
        s.name as scheme_name
      FROM applied_schemes a
      JOIN schemes s ON a.scheme_id = s.id
      WHERE a.id = ?`;
    con.query(sql, [appId], async (err, rows) => {
        if (err) { console.error('DB error:', err); res.status(500).send('Database error'); return; }
        const rec = rows && rows[0];
        if (!rec) { res.status(404).send('Application not found'); return; }
        const to = rec.user_email;
        const status = rec.application_status;
        const schemeName = rec.scheme_name || 'Scheme';
        const subject = `Update on your application for ${schemeName}: ${status.replace('_',' ').toUpperCase()}`;
        const text = `Hello,

Your application for "${schemeName}" has been updated.

Current Status: ${status}
Notes: ${rec.application_notes || 'N/A'}
Applied On: ${rec.applied_at}
Updated On: ${rec.updated_at}

Thank you,
Sarkari Sahayak`;

        try {
            if (!mailTransporter || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
                console.warn('SMTP not fully configured; skipping actual email send.');
                res.json({ ok: true, message: 'SMTP not configured; pretending to send email', to, subject });
                return;
            }
            const info = await mailTransporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, text });
            res.json({ ok: true, messageId: info.messageId });
        } catch (e) {
            console.error('Email send failed:', e);
            res.status(500).send('Failed to send email');
        }
    });
});

// add scheme
app.post("/schemes", (req, res) => {
    let sql = "INSERT INTO schemes(name, category, basic_info, objectives, benefits, eligibility, documents) VALUES(?,?,?,?,?,?,?)";
    let docs = Array.isArray(req.body.documents) ? req.body.documents.join(",") : (req.body.documents || "");
    let data = [req.body.name, req.body.category, (req.body.basicInfo || ""), (req.body.objectives || ""), (req.body.benefits || ""), (req.body.eligibility || ""), docs];
    
    con.query(sql, data, (error, result) => {
        if (error) {
            console.error("DB error:", error);
            res.status(500).send("Database error");
            return;
        }
        res.send("Scheme added");
    });
});

// list schemes
app.get("/schemes", (req, res) => {
    // Some databases may not have created_at; avoid selecting it to prevent errors
    let sql = "SELECT id, name, category, basic_info, objectives, benefits, eligibility, documents FROM schemes ORDER BY id DESC";
    con.query(sql, (error, result) => {
        if (error) {
            console.error("DB error:", error);
            res.status(500).send("Database error");
            return;
        }
        res.json(result);
    });
});

// get single scheme with rich fields
app.get('/schemes/:id', (req, res) => {
    const sql = 'SELECT id, name, category, basic_info, objectives, benefits, eligibility, documents FROM schemes WHERE id=?';
    con.query(sql, [req.params.id], (error, result) => {
        if (error) { console.error('DB error:', error); res.status(500).send('Database error'); return; }
        res.json(result[0] || null);
    });
});

// scheme questions endpoints
app.get('/schemes/:id/questions', (req, res) => {
    const sql = `SELECT id, scheme_id, sort_order, question_text, expected_answer, next_on_yes, next_on_no, is_terminal_yes, is_terminal_no
                 FROM scheme_questions WHERE scheme_id=? ORDER BY sort_order ASC, id ASC`;
    con.query(sql, [req.params.id], (error, result) => {
        if (error) { console.error('DB error:', error); res.status(500).send('Database error'); return; }
        res.json(result);
    });
});

app.post('/schemes/:id/questions', (req, res) => {
    const { sort_order, question_text, expected_answer, next_on_yes, next_on_no, is_terminal_yes, is_terminal_no } = req.body;
    const sql = `INSERT INTO scheme_questions (scheme_id, sort_order, question_text, expected_answer, next_on_yes, next_on_no, is_terminal_yes, is_terminal_no)
                 VALUES (?,?,?,?,?,?,?,?)`;
    const data = [req.params.id, sort_order || 1, question_text, expected_answer || 'yes', next_on_yes || null, next_on_no || null, is_terminal_yes ? 1 : 0, is_terminal_no ? 1 : 0];
    con.query(sql, data, (error) => {
        if (error) { console.error('DB error:', error); res.status(500).send('Database error'); return; }
        res.send('Question added');
    });
});

// update a single question
app.put('/schemes/:schemeId/questions/:questionId', (req, res) => {
    const { sort_order, question_text, expected_answer, next_on_yes, next_on_no, is_terminal_yes, is_terminal_no } = req.body;
    const sql = `UPDATE scheme_questions SET
                    sort_order = ?,
                    question_text = ?,
                    expected_answer = ?,
                    next_on_yes = ?,
                    next_on_no = ?,
                    is_terminal_yes = ?,
                    is_terminal_no = ?
                 WHERE id = ? AND scheme_id = ?`;
    const data = [
        Number(sort_order) || 1,
        question_text,
        expected_answer === 'no' ? 'no' : 'yes',
        (next_on_yes === null || next_on_yes === '' ? null : Number(next_on_yes)),
        (next_on_no === null || next_on_no === '' ? null : Number(next_on_no)),
        (is_terminal_yes ? 1 : 0),
        (is_terminal_no ? 1 : 0),
        Number(req.params.questionId),
        Number(req.params.schemeId)
    ];
    con.query(sql, data, (error, result) => {
        if (error) { console.error('DB error:', error); res.status(500).send('Database error'); return; }
        if (result.affectedRows === 0) { res.status(404).send('Question not found'); return; }
        res.send('Question updated');
    });
});

// delete a single question
app.delete('/schemes/:schemeId/questions/:questionId', (req, res) => {
    const sql = `DELETE FROM scheme_questions WHERE id = ? AND scheme_id = ?`;
    const data = [Number(req.params.questionId), Number(req.params.schemeId)];
    con.query(sql, data, (error, result) => {
        if (error) { console.error('DB error:', error); res.status(500).send('Database error'); return; }
        if (result.affectedRows === 0) { res.status(404).send('Question not found'); return; }
        res.send('Question deleted');
    });
});

// update scheme
app.put("/schemes/:id", (req, res) => {
    let sql = "UPDATE schemes SET name=?, category=?, basic_info=?, objectives=?, benefits=?, eligibility=?, documents=? WHERE id=?";
    let docs = Array.isArray(req.body.documents) ? req.body.documents.join(",") : (req.body.documents || "");
    let data = [req.body.name, req.body.category, (req.body.basicInfo || ""), (req.body.objectives || ""), (req.body.benefits || ""), (req.body.eligibility || ""), docs, req.params.id];
    
    con.query(sql, data, (error, result) => {
        if (error) {
            console.error("DB error:", error);
            res.status(500).send("Database error");
            return;
        }
        res.send("Scheme updated");
    });
});

// delete scheme
app.delete("/schemes/:id", (req, res) => {
    let sql = "DELETE FROM schemes WHERE id = ?";
    con.query(sql, [req.params.id], (error, result) => {
        if (error) {
            console.error("DB error:", error);
            res.status(500).send("Database error");
            return;
        }
        res.send("Scheme deleted");
    });
});

// Apply for a scheme (idempotent for same user+scheme)
app.post("/apply-scheme", (req, res) => {
    const { user_email, scheme_id, applied_documents, application_notes } = req.body;
    if (!user_email || !scheme_id) {
        res.status(400).send("Missing required fields: user_email, scheme_id");
        return;
    }
    // Ensure user exists for FK constraint
    const ensureUserSql = "INSERT INTO users(uid,email) VALUES(?,?) ON DUPLICATE KEY UPDATE uid = uid";
    con.query(ensureUserSql, [user_email, user_email], (uErr) => {
        if (uErr) {
            console.error("DB error (ensure user):", uErr);
            res.status(500).send("Database error (ensure user)");
            return;
        }
        let sql = `INSERT INTO applied_schemes (user_email, scheme_id, applied_documents, application_notes) 
                   VALUES (?, ?, ?, ?)
                   ON DUPLICATE KEY UPDATE 
                   applied_documents = VALUES(applied_documents),
                   application_notes = VALUES(application_notes),
                   updated_at = CURRENT_TIMESTAMP`;
        let data = [user_email, scheme_id, applied_documents || "", application_notes || ""];
        con.query(sql, data, (error) => {
            if (error) {
                console.error("DB error (apply):", error);
                // Provide hint if foreign key fails on scheme
                const msg = String(error?.message || '').toLowerCase().includes('foreign key') ?
                  'Invalid scheme_id or user_email (FK violation)' : 'Database error';
                res.status(500).send(msg);
                return;
            }
            res.send("Application submitted successfully");
        });
    });
});

// Get user's applied schemes
app.get("/applied-schemes/:user_email", (req, res) => {
    const user_email = req.params.user_email;
    let sql = `SELECT 
        a.id, 
        a.application_status, 
        a.applied_documents, 
        a.application_notes, 
        a.applied_at, 
        a.updated_at,
        s.name as scheme_name,
        s.category as scheme_category,
        s.basic_info as scheme_info,
        s.documents as required_documents
    FROM applied_schemes a
    JOIN schemes s ON a.scheme_id = s.id 
    WHERE a.user_email = ? 
    ORDER BY a.applied_at DESC`;
    
    con.query(sql, [user_email], (error, result) => {
        if (error) {
            console.error("DB error:", error);
            res.status(500).send("Database error");
            return;
        }
        res.json(result);
    });
});

// Get user profile
app.get("/user-profile/:user_email", (req, res) => {
    const user_email = req.params.user_email;
    let sql = "SELECT * FROM user_profiles WHERE user_email = ?";
    
    con.query(sql, [user_email], (error, result) => {
        if (error) {
            console.error("DB error:", error);
            res.status(500).send("Database error");
            return;
        }
        res.json(result[0] || null);
    });
});

// Create or update user profile
app.post("/user-profile", (req, res) => {
    const { user_email, full_name, phone, address, profile_photo } = req.body;

    const ensureUserSql = "INSERT INTO users(uid,email) VALUES(?,?) ON DUPLICATE KEY UPDATE uid = uid";
    const uidFallback = user_email; // fallback uid if user was created via profile
    con.query(ensureUserSql, [uidFallback, user_email], (uErr) => {
        if (uErr) {
            console.error("DB error (ensure user):", uErr);
            res.status(500).send("Database error");
            return;
        }

        let sql = `INSERT INTO user_profiles (user_email, full_name, phone, address, profile_photo) 
                   VALUES (?, ?, ?, ?, ?) 
                   ON DUPLICATE KEY UPDATE 
                   full_name = VALUES(full_name), 
                   phone = VALUES(phone), 
                   address = VALUES(address), 
                   profile_photo = VALUES(profile_photo),
                   updated_at = CURRENT_TIMESTAMP`;
        let data = [user_email, full_name, phone, address, profile_photo];

        con.query(sql, data, (error, result) => {
            if (error) {
                console.error("DB error (save profile):", error);
                res.status(500).send("Database error");
                return;
            }
            res.send("Profile updated successfully");
        });
    });
});

// Upload user photo
app.post('/upload/photo', (req, res, next) => { req.uploadType = 'photo'; next(); }, upload.single('photo'), (req, res) => {
    const filePath = req.file ? req.file.path : null;
    if (!filePath) {
        res.status(400).send('No file uploaded');
        return;
    }
    const relative = `/files/${path.relative(FILES_ROOT, filePath).replace(/\\/g, '/')}`;
    const base = `${req.protocol}://${req.get('host')}`;
    const publicUrl = `${base}${relative}`;
    res.json({ path: publicUrl });
});

// Upload user document
app.post('/upload/document', (req, res, next) => { req.uploadType = 'document'; next(); }, upload.single('document'), (req, res) => {
    const filePath = req.file ? req.file.path : null;
    if (!filePath) {
        res.status(400).send('No file uploaded');
        return;
    }
    const relative = `/files/${path.relative(FILES_ROOT, filePath).replace(/\\/g, '/')}`;
    const base = `${req.protocol}://${req.get('host')}`;
    const publicUrl = `${base}${relative}`;
    res.json({ path: publicUrl });
});

// Update application status (for admin)
app.put("/application-status/:id", (req, res) => {
    const { status, admin_notes } = req.body;
    const id = req.params.id;
    const sql = "UPDATE applied_schemes SET application_status = ?, application_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    const data = [status, admin_notes || "", id];

    con.query(sql, data, (error, result) => {
        if (error) {
            console.error("DB error:", error);
            res.status(500).send("Database error");
            return;
        }

        // Fetch full application to get user email and scheme for notification
        const q = `SELECT a.id, a.user_email, a.application_status, a.application_notes, a.updated_at, s.name as scheme_name
                   FROM applied_schemes a JOIN schemes s ON a.scheme_id = s.id WHERE a.id = ?`;
        con.query(q, [id], async (e2, rows) => {
            if (e2) {
                console.error('DB error (post-update fetch):', e2);
                res.send("Application status updated");
                return;
            }
            const rec = rows && rows[0];
            if (!rec) { res.send("Application status updated"); return; }

            const to = rec.user_email;
            const schemeName = rec.scheme_name || 'Scheme';
            const subj = `Update on your application for ${schemeName}: ${String(rec.application_status || '').replace('_',' ').toUpperCase()}`;
            const body = `Hello,\n\nYour application for "${schemeName}" has been updated.\n\nCurrent Status: ${rec.application_status}\nNotes: ${rec.application_notes || 'N/A'}\nUpdated On: ${rec.updated_at}\n\nThank you,\nSarkari Sahayak`;

            try {
                if (!mailTransporter || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
                    console.warn('SMTP not fully configured; skipping actual email send.');
                    res.json({ ok: true, message: 'Application status updated (email not sent: SMTP not configured)', to, subject: subj });
                    return;
                }
                const info = await mailTransporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject: subj, text: body });
                res.json({ ok: true, message: 'Application status updated and email sent', messageId: info.messageId });
            } catch (sendErr) {
                console.error('Email send failed:', sendErr);
                res.json({ ok: true, message: 'Application status updated but failed to send email' });
            }
        });
    });
});

// Get all applications (for admin)
app.get("/all-applications", (req, res) => {
    let sql = `SELECT 
        a.id, 
        a.user_email,
        a.application_status, 
        a.applied_documents, 
        a.application_notes, 
        a.applied_at, 
        a.updated_at,
        s.name as scheme_name,
        s.category as scheme_category,
        s.basic_info as scheme_info,
        up.full_name as user_name,
        up.phone as user_phone
    FROM applied_schemes a
    JOIN schemes s ON a.scheme_id = s.id 
    LEFT JOIN user_profiles up ON a.user_email = up.user_email
    ORDER BY a.applied_at DESC`;
    
    con.query(sql, (error, result) => {
        if (error) {
            console.error("DB error:", error);
            res.status(500).send("Database error");
            return;
        }
        res.json(result);
    });
});

ensureSchema();

app.listen(9000, () => {
    console.log("Ready to serve @9000");
});