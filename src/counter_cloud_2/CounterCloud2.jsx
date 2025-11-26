import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Paper,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";

import {
  Document,
  Packer,
  Paragraph,
  Table as DocxTable,
  TableRow as DocxRow,
  TableCell as DocxCell,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";

// =====================================================
// Таблица вариантов (из PDF)
// =====================================================
const variants = [
  { id: 0, Ttrue: 1, Tfalse: 100, F: "Дизъюнкция", p1: 10000, p2: 100000 },
  { id: 1, Ttrue: 10, Tfalse: 440, F: "Конъюнкция", p1: 12000, p2: 250000 },
  { id: 2, Ttrue: 1, Tfalse: 180, F: "Дизъюнкция", p1: 37000, p2: 310000 },
  { id: 3, Ttrue: 1, Tfalse: 370, F: "Конъюнкция", p1: 41000, p2: 100000 },
  { id: 4, Ttrue: 8, Tfalse: 300, F: "Дизъюнкция", p1: 33000, p2: 500000 },
  { id: 5, Ttrue: 1, Tfalse: 210, F: "Конъюнкция", p1: 16000, p2: 360000 },
  { id: 6, Ttrue: 4, Tfalse: 310, F: "Дизъюнкция", p1: 20000, p2: 110000 },
  { id: 7, Ttrue: 3, Tfalse: 240, F: "Конъюнкция", p1: 32000, p2: 400000 },
  { id: 8, Ttrue: 4, Tfalse: 240, F: "Дизъюнкция", p1: 33000, p2: 310000 },
  { id: 9, Ttrue: 4, Tfalse: 440, F: "Конъюнкция", p1: 43000, p2: 490000 },
  { id: 10, Ttrue: 6, Tfalse: 190, F: "Дизъюнкция", p1: 11000, p2: 410000 },
  { id: 11, Ttrue: 4, Tfalse: 490, F: "Конъюнкция", p1: 25000, p2: 320000 },
  { id: 12, Ttrue: 8, Tfalse: 420, F: "Дизъюнкция", p1: 21000, p2: 490000 },
  { id: 13, Ttrue: 2, Tfalse: 140, F: "Конъюнкция", p1: 48000, p2: 250000 },
  { id: 14, Ttrue: 6, Tfalse: 450, F: "Дизъюнкция", p1: 34000, p2: 460000 },
  { id: 15, Ttrue: 5, Tfalse: 140, F: "Конъюнкция", p1: 34000, p2: 240000 },
  { id: 16, Ttrue: 6, Tfalse: 370, F: "Дизъюнкция", p1: 17000, p2: 220000 },
  { id: 17, Ttrue: 9, Tfalse: 130, F: "Конъюнкция", p1: 17000, p2: 500000 },
  { id: 18, Ttrue: 10, Tfalse: 190, F: "Дизъюнкция", p1: 23000, p2: 120000 },
  { id: 19, Ttrue: 2, Tfalse: 160, F: "Конъюнкция", p1: 31000, p2: 490000 },
  { id: 20, Ttrue: 5, Tfalse: 150, F: "Дизъюнкция", p1: 24000, p2: 480000 },
  { id: 21, Ttrue: 1, Tfalse: 490, F: "Конъюнкция", p1: 16000, p2: 310000 },
  { id: 22, Ttrue: 2, Tfalse: 370, F: "Дизъюнкция", p1: 44000, p2: 160000 },
  { id: 23, Ttrue: 2, Tfalse: 310, F: "Конъюнкция", p1: 36000, p2: 380000 },
  { id: 24, Ttrue: 5, Tfalse: 330, F: "Дизъюнкция", p1: 11000, p2: 450000 },
  { id: 25, Ttrue: 2, Tfalse: 220, F: "Конъюнкция", p1: 20000, p2: 110000 },
];

// =====================================================
// Компонент
// =====================================================
const CounterCloud2 = () => {
  const [variant, setVariant] = useState(0);
  const [data, setData] = useState(variants[0]);
  const [result, setResult] = useState(null);

  const handleVariantChange = (e) => {
    const selected = variants.find((v) => v.id === Number(e.target.value));
    setVariant(selected.id);
    setData(selected);
    setResult(null);
  };

  // =====================================================
  // Расчеты TT, TF, FT, FF
  // =====================================================
  const calculate = () => {
    const { Ttrue, Tfalse, F, p1, p2 } = data;

    const parallel = (a, b) =>
      F === "Дизъюнкция" ? Math.max(a, b) : Math.min(a, b);

    const TT = { A1: "T", A2: "T", T1: Ttrue + Ttrue, T2: parallel(Ttrue, Ttrue) };
    const TF = { A1: "T", A2: "F", T1: Ttrue + Tfalse, T2: parallel(Ttrue, Tfalse) };
    const FT = { A1: "F", A2: "T", T1: Tfalse + Ttrue, T2: parallel(Tfalse, Ttrue) };
    const FF = { A1: "F", A2: "F", T1: Tfalse + Tfalse, T2: parallel(Tfalse, Tfalse) };

    const cases = [TT, TF, FT, FF];

    const T1_avg = cases.reduce((s, c) => s + c.T1, 0) / 4;
    const T2_avg = cases.reduce((s, c) => s + c.T2, 0) / 4;

    const n = 2;
    const S = T1_avg / T2_avg;
    const E = S / n;
    const R = p2 / p1;
    const U = R * E;
    const Q = (S * E) / R;

    setResult({
      cases,
      T1_avg,
      T2_avg,
      S,
      E,
      R,
      U,
      Q,
    });
  };

  // =====================================================
  // Генерация Word-файла (.docx)
  // =====================================================
  const generateWord = async () => {
    if (!result) return;

    const headerRow = new DocxRow({
      children: [
        new DocxCell({ children: [new Paragraph("A1")] }),
        new DocxCell({ children: [new Paragraph("A2")] }),
        new DocxCell({ children: [new Paragraph("Последовательный")] }),
        new DocxCell({ children: [new Paragraph("Параллельный")] }),
      ],
    });

    const bodyRows = result.cases.map(
      (c) =>
        new DocxRow({
          children: [
            new DocxCell({ children: [new Paragraph(c.A1)] }),
            new DocxCell({ children: [new Paragraph(c.A2)] }),
            new DocxCell({ children: [new Paragraph(c.T1.toFixed(4))] }),
            new DocxCell({ children: [new Paragraph(c.T2.toFixed(4))] }),
          ],
        })
    );

    const table = new DocxTable({
      rows: [headerRow, ...bodyRows],
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Задача 2 (ТИСОС) — Вариант ${variant}`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph(" "),
            new Paragraph("Таблица расчётов:"),
            table,
            new Paragraph(" "),
            new Paragraph(`Среднее T1 = ${result.T1_avg.toFixed(4)} c`),
            new Paragraph(`Среднее T2 = ${result.T2_avg.toFixed(4)} c`),
            new Paragraph(`S(n) = ${result.S.toFixed(4)}`),
            new Paragraph(`E(n) = ${result.E.toFixed(4)}`),
            new Paragraph(`R(n) = ${result.R.toFixed(4)}`),
            new Paragraph(`U(n) = ${result.U.toFixed(4)}`),
            new Paragraph(`Q(n) = ${result.Q.toFixed(4)}`),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `TISOS_Zadacha2_Variant${variant}.docx`);
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <Paper sx={{ p: 3, maxWidth: 820, margin: "0 auto" }}>
      <Typography variant="h5" gutterBottom>
        ТИСОС — Задача 2 (таблица расчётов как в PDF)
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

      {/* Данные */}
      <Stack spacing={2}>
        <TextField label="T(A)=true" value={data.Ttrue} />
        <TextField label="T(A)=false" value={data.Tfalse} />
        <TextField label="F(A)" value={data.F} />
        <TextField label="p1" value={data.p1} />
        <TextField label="p2" value={data.p2} />
      </Stack>

      <Button variant="contained" sx={{ mt: 3 }} onClick={calculate}>
        Рассчитать
      </Button>

      {result && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Таблица расчётов (как в методичке)
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>A1</b></TableCell>
                <TableCell><b>A2</b></TableCell>
                <TableCell><b>Последовательный</b></TableCell>
                <TableCell><b>Параллельный</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.cases.map((c, idx) => (
                <TableRow key={idx}>
                  <TableCell>{c.A1}</TableCell>
                  <TableCell>{c.A2}</TableCell>
                  <TableCell>{c.T1.toFixed(4)}</TableCell>
                  <TableCell>{c.T2.toFixed(4)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Метрики */}
          <Typography sx={{ mt: 3 }}>
            Среднее последовательное время: <b>{result.T1_avg.toFixed(4)} c</b>
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Среднее параллельное время: <b>{result.T2_avg.toFixed(4)} c</b>
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Ускорение S(n): <b>{result.S.toFixed(4)}</b>
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Эффективность E(n): <b>{result.E.toFixed(4)}</b>
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Избыточность R(n): <b>{result.R.toFixed(4)}</b>
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Коэффициент полезного использования U(n): <b>{result.U.toFixed(4)}</b>
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Качество Q(n): <b>{result.Q.toFixed(4)}</b>
          </Typography>

          <Button variant="outlined" sx={{ mt: 2 }} onClick={generateWord}>
            Скачать Word-файл
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default CounterCloud2;
