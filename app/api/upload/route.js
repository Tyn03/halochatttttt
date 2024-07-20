import { IncomingForm } from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import nextConnect from 'next-connect';

export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadDir = './public/uploads/';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const handler = nextConnect();

handler.use((req, res, next) => {
    const form = new IncomingForm({
        uploadDir,
        keepExtensions: true,
        filename: (name, ext, part) => `${uuidv4()}${ext}`,
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'File upload failed' });
        }

        req.files = files;
        req.body = fields;
        next();
    });
});

handler.post((req, res) => {
    const filePath = req.files.file.filepath;
    const fileUrl = `/uploads/${filePath.split('/').pop()}`;
    res.status(200).json({ url: fileUrl });
});

export default handler;
