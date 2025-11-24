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

// ================================
// Таблица вариантов (Задача 3)
// ================================
const variants = [
  { id: 1, m: 128, n: 130, k: 32, t: 25, T: 5 },
  { id: 2, m: 768, n: 602, k: 128, t: 35, T: 7 },
  { id: 3, m: 1024, n: 1024, k: 1024, t: 50, T: 20 },
  { id: 4, m: 1200, n: 768, k: 1024, t: 25, T: 25 },
  { id: 5, m: 256, n: 192, k: 16, t: 20, T: 14 },
  { id: 6, m: 1200, n: 900, k: 4, t: 10, T: 12 },
  { id: 7, m: 640, n: 480, k: 64, t: 30, T: 16 },
  { id: 8, m: 512, n: 256, k: 128, t: 10, T: 22 },
  { id: 9, m: 640, n: 384, k: 256, t: 15, T: 23 },
  { id: 10, m: 640, n: 320, k: 512, t: 20, T: 24 },
  { id: 11, m: 640, n: 321, k: 512, t: 45, T: 9 },
  { id: 12, m: 800, n: 600, k: 64, t: 5, T: 21 },
  { id: 13, m: 250, n: 300, k: 512, t: 20, T: 19 },
  { id: 14, m: 1024, n: 600, k: 2, t: 5, T: 1 },
  { id: 15, m: 320, n: 240, k: 256, t: 40, T: 8 },
  { id: 16, m: 1200, n: 1024, k: 1024, t: 50, T: 10 },
  { id: 17, m: 1600, n: 900, k: 16, t: 20, T: 4 },
  { id: 18, m: 600, n: 1000, k: 8, t: 15, T: 3 },
  { id: 19, m: 128, n: 320, k: 4, t: 10, T: 2 },
  { id: 20, m: 160, n: 128, k: 64, t: 30, T: 6 },
  { id: 21, m: 600, n: 400, k: 256, t: 40, T: 18 },
  { id: 22, m: 600, n: 400, k: 2, t: 5, T: 11 },
  { id: 23, m: 512, n: 301, k: 128, t: 30, T: 17 },
  { id: 24, m: 512, n: 512, k: 32, t: 25, T: 15 },
  { id: 25, m: 1600, n: 1200, k: 8, t: 15, T: 13 },
];

// ================================
// Основной компонент
// ================================
const ImgStore = () => {
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
    setData((prev) => ({ ...prev, [field]: Number(value) }));
  };

  // ================================
  // Основная формула:
  //
  // V = ceil( (m * n * log2(k) * (3600*T/t)) / (8 * 1024 * 1024) )
  //
  // ================================
  const calculate = () => {
    const { m, n, k, t, T } = data;

    const code = Math.ceil(Math.log2(k)); // количество бит на пиксель

    const l = Math.floor((3600 * T) / t); // количество снимков

    const v = m * n * code; // бит на 1 снимок

    const totalBits = v * l;

    const totalMB = totalBits / (8 * 1024 * 1024);

    const rounded = Math.ceil(totalMB);

    setResult({
      code,
      l,
      v,
      totalBits,
      totalMB,
      rounded,
    });
  };

  // ================================
  // Word-файл
  // ================================
  const generateWord = async () => {
    if (!result) return;

    const { m, n, k, t, T } = data;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Задача 3. Объём хранилища для серии изображений",
                  bold: true,
                }),
              ],
            }),
            new Paragraph(" "),
            new Paragraph("Исходные данные:"),
            new Paragraph(`Размер изображения: ${m} × ${n} пикселей`),
            new Paragraph(`Число оттенков: ${k}`),
            new Paragraph(`Период съёмки: t = ${t} сек`),
            new Paragraph(`Время работы: T = ${T} часов`),
            new Paragraph(" "),
            new Paragraph(`Код на 1 пиксель = ceil(log2(k)) = ${result.code} бит`),
            new Paragraph(`Количество снимков l = ${result.l}`),
            new Paragraph(`Объём одного снимка v = ${result.v} бит`),
            new Paragraph(`Общий объём = ${result.totalMB.toFixed(4)} Мбайт`),
            new Paragraph(`Результат: ${result.rounded} Мбайт`),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Задача3_Вариант${variant}.docx`);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 700, margin: "0 auto" }}>
      <Typography variant="h5" gutterBottom>
        Задача 3. Хранение растровых изображений
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
          label="m (ширина)"
          type="number"
          value={data.m}
          onChange={(e) => handleChange("m", e.target.value)}
        />
        <TextField
          label="n (высота)"
          type="number"
          value={data.n}
          onChange={(e) => handleChange("n", e.target.value)}
        />
        <TextField
          label="k (оттенков)"
          type="number"
          value={data.k}
          onChange={(e) => handleChange("k", e.target.value)}
        />
        <TextField
          label="t (сек)"
          type="number"
          value={data.t}
          onChange={(e) => handleChange("t", e.target.value)}
        />
        <TextField
          label="T (часов)"
          type="number"
          value={data.T}
          onChange={(e) => handleChange("T", e.target.value)}
        />
      </Stack>

      <Button variant="contained" sx={{ mt: 3 }} onClick={calculate}>
        Рассчитать
      </Button>

      {result && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Пошаговое решение:</Typography>

          <Typography sx={{ mt: 1 }}>
            1. Число бит на пиксель: code = ceil(log₂({data.k})) = {result.code}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            2. Объём одного снимка:
            <br />
            v = m × n × code = {data.m} × {data.n} × {result.code} = {result.v} бит
          </Typography>

          <Typography sx={{ mt: 1 }}>
            3. Количество снимков:
            <br />
            l = ⌊3600 × {data.T} / {data.t}⌋ = {result.l}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            4. Общий объём:
            <br />
            V = v × l = {result.totalBits} бит
            <br />
            = {result.totalMB.toFixed(4)} Мбайт
          </Typography>

          <Typography sx={{ mt: 1 }}>
            5. Округление вверх:{" "}
            <strong>{result.rounded} Мбайт</strong>
          </Typography>

          <Button variant="outlined" sx={{ mt: 2 }} onClick={generateWord}>
            Скачать Word-файл
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default ImgStore;
