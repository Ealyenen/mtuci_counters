import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import Span from "./Span";

// ======================
// Таблица вариантов (Задача 2)
// ======================
const variants = [
  { id: 1, h: 32, n: 14, v: 16, t: 18 },
  { id: 2, h: 48, n: 22, v: 8, t: 8 },
  { id: 3, h: 16, n: 6, v: 24, t: 24 },
  { id: 4, h: 80, n: 38, v: 32, t: 10 },
  { id: 5, h: 12, n: 4, v: 16, t: 28 },
  { id: 6, h: 90, n: 44, v: 16, t: 16 },
  { id: 7, h: 72, n: 34, v: 16, t: 12 },
  { id: 8, h: 36, n: 16, v: 24, t: 14 },
  { id: 9, h: 60, n: 28, v: 32, t: 12 },
  { id: 10, h: 76, n: 36, v: 24, t: 8 },
  { id: 11, h: 92, n: 46, v: 24, t: 8 },
  { id: 12, h: 40, n: 18, v: 32, t: 12 },
  { id: 13, h: 8, n: 2, v: 8, t: 22 },
  { id: 14, h: 88, n: 42, v: 8, t: 8 },
  { id: 15, h: 84, n: 40, v: 64, t: 6 },
  { id: 16, h: 44, n: 20, v: 64, t: 10 },
  { id: 17, h: 56, n: 26, v: 24, t: 16 },
  { id: 18, h: 28, n: 12, v: 8, t: 16 },
  { id: 19, h: 96, n: 48, v: 64, t: 4 },
  { id: 20, h: 24, n: 10, v: 64, t: 4 },
  { id: 21, h: 94, n: 48, v: 32, t: 8 },
  { id: 22, h: 64, n: 30, v: 64, t: 10 },
  { id: 23, h: 68, n: 32, v: 8, t: 8 },
  { id: 24, h: 20, n: 8, v: 32, t: 20 },
  { id: 25, h: 52, n: 24, v: 16, t: 10 },
];

// ======================
// Основной компонент
// ======================
const CounterAudio2 = () => {
  const [variant, setVariant] = useState(1);
  const [data, setData] = useState(variants[0]);
  const [result, setResult] = useState(null);

  const handleVariantChange = (event) => {
    const selected = variants.find(v => v.id === Number(event.target.value));
    if (selected) {
      setVariant(selected.id);
      setData(selected);
      setResult(null);
    }
  };

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: Number(value) }));
  };

  // ======================
  // Формула: V = ceil( h * 1000 * n * v * t * 60 / (8 * 1024 * 1024) )
  // ======================
  const calculate = () => {
    const { h, n, v, t } = data;

    const bytes =
      h * 1000 *
      n *
      v *
      (t * 60) /
      8;

    const mbytes = bytes / (1024 * 1024);

    const resultValue = Math.ceil(mbytes);

    setResult({
      bytes,
      mbytes,
      rounded: resultValue,
    });
  };

  // ======================
  // Word-файл
  // ======================
  const generateWord = async () => {
    if (!result) return;

    const { h, n, v, t } = data;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Задача 2. Определение размера аудиофайла (AAC)",
                  bold: true,
                }),
              ],
            }),
            new Paragraph(" "),
            new Paragraph("Исходные данные:"),
            new Paragraph(`h = ${h} кГц`),
            new Paragraph(`n = ${n} каналов`),
            new Paragraph(`v = ${v} бит`),
            new Paragraph(`t = ${t} мин`),
            new Paragraph(" "),
            new Paragraph("Формула:"),
            new Paragraph(`V = ceil( h × 1000 × n × v × t × 60 / (8 × 1024 × 1024) )`),
            new Paragraph(" "),
            new Paragraph(`Неокруглённо: ${result.mbytes.toFixed(4)} Мбайт`),
            new Paragraph(`Результат: ${result.rounded} Мбайт`),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Задача2_Вариант${variant}.docx`);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 700, margin: "0 auto" }}>
      <Typography variant="h5" gutterBottom>
        Задача 2. Размер аудиофайла AAC
      </Typography>

      {/* Выбор варианта */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Вариант</InputLabel>
        <Select value={variant} label="Вариант" onChange={handleVariantChange}>
          {variants.map((v) => (
            <MenuItem key={v.id} value={v.id}>
              Вариант {v.id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Поля */}
      <Stack spacing={2}>
        <TextField
          label="h (кГц)"
          type="number"
          value={data.h}
          onChange={(e) => handleChange("h", e.target.value)}
        />
        <TextField
          label="n (каналы)"
          type="number"
          value={data.n}
          onChange={(e) => handleChange("n", e.target.value)}
        />
        <TextField
          label="v (бит)"
          type="number"
          value={data.v}
          onChange={(e) => handleChange("v", e.target.value)}
        />
        <TextField
          label="t (мин)"
          type="number"
          value={data.t}
          onChange={(e) => handleChange("t", e.target.value)}
        />
      </Stack>

      <Button variant="contained" sx={{ mt: 3 }} onClick={calculate}>
        Рассчитать
      </Button>

      {result && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Пошаговое решение:</Typography>

          <Typography sx={{ mt: 1 }}>
            1. Переводим:
            <br />
            h × 1000 = {data.h * 1000} Гц
            <br />
            t × 60 = {data.t * 60} сек
          </Typography>

          <Typography sx={{ mt: 1 }}>
            2. Объём в байтах:
            <br />
            V = h × 1000 × n × v × t × 60 / 8 =
            <br />
            = {result.bytes.toFixed(0)} байт
          </Typography>

          <Typography sx={{ mt: 1 }}>
            3. В Мбайтах:
            <br />
            {result.mbytes.toFixed(4)} Мбайт
          </Typography>

          <Typography sx={{ mt: 1 }}>
            4. Округление вверх:
            <strong> {result.rounded} Мбайт</strong>
          </Typography>

          <Button variant="outlined" sx={{ mt: 2 }} onClick={generateWord}>
            Скачать Word-файл
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default CounterAudio2;
