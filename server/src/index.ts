import express from 'express';
import cors from 'cors';
import searchRouter from './routes/search';
import albumRouter from './routes/album';
import topAlbumsRouter from './routes/topAlbums';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ['http://localhost:7070', 'http://localhost:4173'] }));
app.use(express.json());

app.use('/api/search', searchRouter);
app.use('/api/album', albumRouter);
app.use('/api/top-albums', topAlbumsRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Albumora server running on http://localhost:${PORT}`);
});
