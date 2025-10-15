import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import Span from "./Span";

// ======================
// Таблица вариантов (из PDF)
// ======================
const variants = [
  { id: 1, m: 100, V: 25, c: 85, h1: 4300, h2: 4700 },
  { id: 2, m: 80, V: 15, c: 80, h1: 2900, h2: 3800 },
  { id: 3, m: 90, V: 40, c: 60, h1: 4100, h2: 3700 },
  { id: 4, m: 120, V: 50, c: 65, h1: 4500, h2: 4800 },
  { id: 5, m: 150, V: 50, c: 55, h1: 3900, h2: 4100 },
  { id: 6, m: 130, V: 10, c: 90, h1: 3400, h2: 3100 },
  { id: 7, m: 70, V: 30, c: 75, h1: 3000, h2: 5200 },
  { id: 8, m: 140, V: 45, c: 60, h1: 4800, h2: 2900 },
  { id: 9, m: 110, V: 15, c: 90, h1: 4800, h2: 4000 },
  { id: 10, m: 110, V: 10, c: 90, h1: 5000, h2: 4500 },
  { id: 11, m: 120, V: 50, c: 55, h1: 3800, h2: 4700 },
  { id: 12, m: 130, V: 40, c: 60, h1: 3600, h2: 4800 },
  { id: 13, m: 100, V: 25, c: 85, h1: 2900, h2: 4800 },
  { id: 14, m: 80, V: 15, c: 90, h1: 4000, h2: 4300 },
  { id: 15, m: 90, V: 40, c: 60, h1: 4700, h2: 2900 },
  { id: 16, m: 120, V: 50, c: 65, h1: 3700, h2: 3900 },
  { id: 17, m: 150, V: 50, c: 55, h1: 4700, h2: 3400 },
  { id: 18, m: 130, V: 10, c: 90, h1: 3100, h2: 2900 },
  { id: 19, m: 70, V: 30, c: 75, h1: 4300, h2: 3000 },
  { id: 20, m: 140, V: 45, c: 60, h1: 5200, h2: 5000 },
  { id: 21, m: 110, V: 15, c: 90, h1: 4900, h2: 4300 },
  { id: 22, m: 110, V: 10, c: 90, h1: 2900, h2: 3600 },
  { id: 23, m: 120, V: 50, c: 55, h1: 4800, h2: 3900 },
  { id: 24, m: 130, V: 40, c: 60, h1: 3600, h2: 3700 },
  { id: 25, m: 100, V: 25, c: 85, h1: 3700, h2: 4900 },

];

// ======================
// Основной компонент
// ======================
const CounterMultimedia1 = () => {
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

  const calculate = () => {
    const { m, V, c, h1, h2 } = data;

    // Формулы по методичке
    const T1 = (Math.pow(2, 23) * m) / (1e6 * V);
    const T2 =
      (Math.pow(2, 23) * m * (25 / h1 + (c / 100) / V + (14 * c) / (100 * h2))) /
      1e6;

    const faster = T1 > T2 ? "архивация быстрее" : "без архивации быстрее";
    const diff = Math.abs(T1 - T2);

    setResult({ T1, T2, faster, diff });
  };

  const generateWord = async () => {
    if (!result) return;

    const { m, V, c, h1, h2 } = data;
    const { T1, T2, diff, faster } = result;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Задача 1. Передача мультимедийных данных",
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph(" "),
            new Paragraph("Исходные данные:"),
            new Paragraph(`m = ${m} Мбайт`),
            new Paragraph(`V = ${V} Мбит/с`),
            new Paragraph(`c = ${c}%`),
            new Paragraph(`h₁ = ${h1} МГц`),
            new Paragraph(`h₂ = ${h2} МГц`),
            new Paragraph(" "),
            new Paragraph({
              children: [
                new TextRun({
                  text: "1. Время передачи без архивации:",
                  bold: true,
                }),
              ],
            }),
            new Paragraph(`T₁ = (2²³ × m) / (10⁶ × V)`),
            new Paragraph(`T₁ = ${(Math.pow(2, 23) * m).toExponential(3)} / (${(1e6 * V).toExponential(3)}) = ${T1.toFixed(2)} с`),

            new Paragraph(" "),
            new Paragraph({
              children: [
                new TextRun({
                  text: "2. Время передачи с архивацией и разархивацией:",
                  bold: true,
                }),
              ],
            }),
            new Paragraph(`T₂ = (2²³ × m × (25/h₁ + c/(100×V) + 14c/(100×h₂))) / 10⁶`),
            new Paragraph(`T₂ = ${T2.toFixed(2)} с`),

            new Paragraph(" "),
            new Paragraph({
              children: [
                new TextRun({
                  text: "3. Сравнение:",
                  bold: true,
                }),
              ],
            }),
            new Paragraph(`Разница = ${diff.toFixed(2)} с — ${faster}`),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Задача1_Вариант${variant}.docx`);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 700, margin: "0 auto" }}>
      <Typography variant="h5" gutterBottom>
        Задача 1. Передача мультимедийных данных
      </Typography>

      {/* Выбор варианта */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="variant-label">Вариант</InputLabel>
        <Select
          labelId="variant-label"
          value={variant}
          label="Вариант"
          onChange={handleVariantChange}
        >
          {variants.map(v => (
            <MenuItem key={v.id} value={v.id}>
              Вариант {v.id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Поля ввода */}
      <Stack spacing={2}>
        <TextField
          label="m (Мбайт)"
          type="number"
          value={data.m}
          onChange={e => handleChange("m", e.target.value)}
        />
        <TextField
          label="V (Мбит/с)"
          type="number"
          value={data.V}
          onChange={e => handleChange("V", e.target.value)}
        />
        <TextField
          label="c (%)"
          type="number"
          value={data.c}
          onChange={e => handleChange("c", e.target.value)}
        />
        <TextField
          label="h₁ (МГц)"
          type="number"
          value={data.h1}
          onChange={e => handleChange("h1", e.target.value)}
        />
        <TextField
          label="h₂ (МГц)"
          type="number"
          value={data.h2}
          onChange={e => handleChange("h2", e.target.value)}
        />
      </Stack>

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={calculate}
      >
        Рассчитать
      </Button>

      {result && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Пошаговое решение:</Typography>

          <Typography sx={{ mt: 1 }}>
            1. Время передачи без архивации:{" "}
            <Typography component="span">
              T<Span>1</Span> = (2<Span top>23</Span> × {data.m}) / (10<Span top>6</Span> × {data.V}) = {result.T1.toFixed(2)} с
            </Typography>
          </Typography>

          <Typography sx={{ mt: 1 }}>
            2. Время с архивацией:{" "}
            <Typography component="span">
              T<Span>2</Span> = (2<Span top>23</Span> × {data.m} × (25/{data.h1} + {data.c}/(100×{data.V}) + 14×{data.c}/(100×{data.h2}))) / 10<Span top>6</Span> = {result.T2.toFixed(2)} с
            </Typography>
          </Typography>

          <Typography sx={{ mt: 1 }}>
            3. Разница: {result.diff.toFixed(2)} с — {result.faster}.
          </Typography>

          <Button variant="outlined" sx={{ mt: 2 }} onClick={generateWord}>
            Скачать Word-файл
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default CounterMultimedia1;
