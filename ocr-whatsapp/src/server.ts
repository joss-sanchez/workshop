import express, { Router } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ProcessWebhook } from "./whatsapp/infrastructure/controllers/ProcessWebhook";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Importante para recibir los datos de los webhooks de whatsapp
app.use(express.urlencoded({ extended: true }));

const router = Router()

router.post('/api/webhook', ProcessWebhook.run)

app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});