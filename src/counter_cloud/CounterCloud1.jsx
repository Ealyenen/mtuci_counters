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

const variants = [
  { id: 0, t1: 15, t2: 3, n: 8, p1: 10_000_000, p2: 100_000_000 },
  { id: 1, t1: 28, t2: 6, n: 6, p1: 60_000_000, p2: 800_000_000 },
  { id: 2, t1: 33, t2: 7, n: 12, p1: 10_000_000, p2: 100_000_000 },
  { id: 3, t1: 15, t2: 6, n: 9, p1: 40_000_000, p2: 900_000_000 },
  { id: 4, t1: 35, t2: 12, n: 11, p1: 60_000_000, p2: 200_000_000 },
  { id: 5, t1: 37, t2: 12, n: 12, p1: 20_000_000, p2: 700_000_000 },
  { id: 6, t1: 36, t2: 12, n: 7, p1: 30_000_000, p2: 300_000_000 },
  { id: 7, t1: 15, t2: 3, n: 11, p1: 22_000_000, p2: 700_000_000 },
  { id: 8, t1: 15, t2: 11, n: 11, p1: 90_000_000, p2: 200_000_000 },
  { id: 9, t1: 36, t2: 9, n: 11, p1: 3_000_000, p2: 100_000_000 },
  { id: 10, t1: 36, t2: 5, n: 8, p1: 40_000_000, p2: 800_000_000 },
  { id: 11, t1: 17, t2: 9, n: 6, p1: 40_000_000, p2: 200_000_000 },
  { id: 12, t1: 38, t2: 7, n: 6, p1: 30_000_000, p2: 800_000_000 },
  { id: 13, t1: 28, t2: 10, n: 11, p1: 30_000_000, p2: 700_000_000 },
  { id: 14, t1: 33, t2: 11, n: 6, p1: 40_000_000, p2: 700_000_000 },
  { id: 15, t1: 29, t2: 11, n: 10, p1: 20_000_000, p2: 500_000_000 },
  { id: 16, t1: 27, t2: 4, n: 8, p1: 20_000_000, p2: 400_000_000 },
  { id: 17, t1: 36, t2: 4, n: 11, p1: 10_000_000, p2: 600_000_000 },
  { id: 18, t1: 15, t2: 8, n: 11, p1: 20_000_000, p2: 400_000_000 },
  { id: 19, t1: 25, t2: 3, n: 12, p1: 10_000_000, p2: 400_000_000 },
  { id: 20, t1: 17, t2: 4, n: 8, p1: 20_000_000, p2: 500_000_000 },
  { id: 21, t1: 29, t2: 6, n: 8, p1: 20_000_000, p2: 600_000_000 },
  { id: 22, t1: 22, t2: 11, n: 9, p1: 50_000_000, p2: 900_000_000 },
  { id: 23, t1: 32, t2: 3, n: 11, p1: 30_000_000, p2: 600_000_000 },
  { id: 24, t1: 18, t2: 5, n: 7, p1: 40_000_000, p2: 900_000_000 },
  { id: 25, t1: 33, t2: 12, n: 9, p1: 90_000_000, p2: 1_100_000_000 },
];

const fmt = (v, digits = 2) =>
  Number.isFinite(v) ? v.toLocaleString(undefined, { maximumFractionDigits: digits }) : "-";

const CounterCloud1 = () => {
  const [variantId, setVariantId] = useState(0);
  const [data, setData] = useState(variants[0]);
  const [result, setResult] = useState(null);

  const handleVariantChange = (e) => {
    const id = Number(e.target.value);
    const sel = variants.find(v => v.id === id);
    if (sel) {
      setVariantId(id);
      setData(sel);
      setResult(null);
    }
  };

  const handleChange = (k, val) => {
    const num = Number(val);
    setData(prev => ({ ...prev, [k]: Number.isNaN(num) ? 0 : num }));
  };

  const calculate = () => {
    const { t1, t2, n, p1, p2 } = data;

    // S(n) = T(1) / T(n)
    const S = t2 === 0 ? Infinity : t1 / t2;

    // E(n) = S(n) / n = T(1) / (n * T(n))
    const E = n === 0 ? 0 : S / n;

    // O(1) = p1 * t1
    const O1 = p1 * t1;

    // O(n) = p2 * t2
    const On = p2 * t2;

    // R(n) = O(n) / O(1)
    const R = O1 === 0 ? Infinity : On / O1;

    setResult({ S, E, O1, On, R });
  };

  const generateWord = async () => {
    if (!result) return;

    const { t1, t2, n, p1, p2 } = data;
    const { S, E, O1, On, R } = result;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Задача. Параллельные вычисления — ускорение, эффективность, избыточность", bold: true, size: 28 })],
            }),
            new Paragraph(" "),
            new Paragraph("Исходные данные:"),
            new Paragraph(`Вариант ${variantId}`),
            new Paragraph(`t₁ = ${t1} с`),
            new Paragraph(`t₂ = ${t2} с`),
            new Paragraph(`n = ${n} шт.`),
            new Paragraph(`p₁ = ${p1.toLocaleString()} действий/с`),
            new Paragraph(`p₂ = ${p2.toLocaleString()} действий/с`),
            new Paragraph(" "),
            new Paragraph({ children: [new TextRun({ text: "1) Ускорение S(n):", bold: true })] }),
            new Paragraph(`S(n) = T(1) / T(n)`),
            new Paragraph(`S(n) = ${t1} / ${t2} = ${fmt(S, 4)}`),
            new Paragraph(" "),
            new Paragraph({ children: [new TextRun({ text: "2) Эффективность E(n):", bold: true })] }),
            new Paragraph(`E(n) = S(n) / n = ${fmt(S, 4)} / ${n} = ${fmt(E, 4)}`),
            new Paragraph(" "),
            new Paragraph({ children: [new TextRun({ text: "3) Объём работ O(1) и O(n):", bold: true })] }),
            new Paragraph(`O(1) = p₁ × t₁ = ${p1.toLocaleString()} × ${t1} = ${O1.toLocaleString()}`),
            new Paragraph(`O(n) = p₂ × t₂ = ${p2.toLocaleString()} × ${t2} = ${On.toLocaleString()}`),
            new Paragraph(" "),
            new Paragraph({ children: [new TextRun({ text: "4) Избыточность R(n):", bold: true })] }),
            new Paragraph(`R(n) = O(n) / O(1) = ${On.toLocaleString()} / ${O1.toLocaleString()} = ${fmt(R, 4)}`),
            new Paragraph(" "),
            new Paragraph({ children: [new TextRun({ text: "Итог:", bold: true })] }),
            new Paragraph(`S(n) = ${fmt(S, 4)}`),
            new Paragraph(`E(n) = ${fmt(E, 4)}`),
            new Paragraph(`O(1) = ${O1.toLocaleString()}`),
            new Paragraph(`O(n) = ${On.toLocaleString()}`),
            new Paragraph(`R(n) = ${fmt(R, 4)}`),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Parallel_Task_Variant_${variantId}.docx`);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 820, margin: "0 auto" }}>
      <Typography variant="h5" gutterBottom>
        Параллельные вычисления — ускорение, эффективность, избыточность
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="variant-label">Вариант</InputLabel>
        <Select
          labelId="variant-label"
          value={variantId}
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

      <Box sx={{display: "flex", gap: 2, flexWrap: "wrap"}}>
        <TextField
          label="t₁ (с)"
          size="small"
          type="number"
          value={data.t1}
          onChange={e => handleChange("t1", e.target.value)}
          sx={{ width: 160 }}
        />
        <TextField
          label="t₂ (с)"
          size="small"
          type="number"
          value={data.t2}
          onChange={e => handleChange("t2", e.target.value)}
          sx={{ width: 160 }}
        />
        <TextField
          label="n (шт)"
          size="small"
          type="number"
          value={data.n}
          onChange={e => handleChange("n", e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          label="p₁ (действ./с)"
          size="small"
          type="number"
          value={data.p1}
          onChange={e => handleChange("p1", e.target.value)}
          sx={{ width: 220 }}
        />
        <TextField
          label="p₂ (действ./с)"
          size="small"
          type="number"
          value={data.p2}
          onChange={e => handleChange("p2", e.target.value)}
          sx={{ width: 220 }}
        />
      </Box>

      <Button variant="contained" sx={{ mt: 2 }} onClick={calculate}>
        Рассчитать
      </Button>

      {result && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Пошаговое решение:</Typography>

          <Typography sx={{ mt: 1 }}>
            1. Ускорение:{" "}
            <Typography component="span">
              S(<Span>n</Span>) = T(<Span>1</Span>) / T(<Span>n</Span>) = {data.t1} / {data.t2} = {fmt(result.S, 4)}
            </Typography>
          </Typography>

          <Typography sx={{ mt: 1 }}>
            2. Эффективность:{" "}
            <Typography component="span">
              E(<Span>n</Span>) = S(<Span>n</Span>) / {data.n} = {fmt(result.S, 4)} / {data.n} = {fmt(result.E, 4)}
            </Typography>
          </Typography>

          <Typography sx={{ mt: 1 }}>
            3. Объём работ:
            <Typography component="span">
              {" "}
              O(<Span>1</Span>) = p<Span>1</Span> × t<Span>1</Span> = {data.p1.toLocaleString()} × {data.t1} = {result.O1.toLocaleString()}
            </Typography>
          </Typography>

          <Typography sx={{ mt: 1 }}>
            &nbsp;&nbsp;&nbsp;&nbsp;O(<Span>n</Span>) = p<Span>2</Span> × t<Span>2</Span> = {data.p2.toLocaleString()} × {data.t2} = {result.On.toLocaleString()}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            4. Избыточность:{" "}
            <Typography component="span">
              R(<Span>n</Span>) = O(<Span>n</Span>) / O(<Span>1</Span>) = {result.On.toLocaleString()} / {result.O1.toLocaleString()} = {fmt(result.R, 4)}
            </Typography>
          </Typography>

          <Typography sx={{ mt: 2, fontWeight: "bold" }}>
            Итог: S(n) = {fmt(result.S, 4)}, E(n) = {fmt(result.E, 4)}, R(n) = {fmt(result.R, 4)}
          </Typography>

          <Button variant="outlined" sx={{ mt: 2 }} onClick={generateWord}>
            Скачать Word-файл
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default CounterCloud1;
