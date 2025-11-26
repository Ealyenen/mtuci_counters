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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
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

// Варианты из PDF: поля a (характеристика), b (топология), p (количество серверов)
const variants = [
  { id: 0, a: "Диаметр", b: "Полное двоичное дерево", p: 63 },
  { id: 1, a: "Ширина бисекции", b: "Полносвязная", p: 92 },
  { id: 2, a: "Стоимость", b: "Полное двоичное дерево", p: 71 },
  { id: 3, a: "Диаметр", b: "Полное двоичное дерево", p: 13 },
  { id: 4, a: "Стоимость", b: "Гиперкуб", p: 43 },
  { id: 5, a: "Стоимость", b: "Решетка-тор N=2", p: 57 },
  { id: 6, a: "Связность", b: "Гиперкуб", p: 97 },
  { id: 7, a: "Ширина бисекции", b: "Полносвязная", p: 51 },
  { id: 8, a: "Диаметр", b: "Гиперкуб", p: 38 },
  { id: 9, a: "Диаметр", b: "Решетка-тор N=2", p: 37 },
  { id: 10, a: "Диаметр", b: "Решетка N=2", p: 83 },
  { id: 11, a: "Диаметр", b: "Кольцо", p: 101 },
  { id: 12, a: "Ширина бисекции", b: "Решетка-тор N=2", p: 81 },
  { id: 13, a: "Стоимость", b: "Решетка N=2", p: 47 },
  { id: 14, a: "Ширина бисекции", b: "Решетка N=2", p: 41 },
  { id: 15, a: "Связность", b: "Решетка-тор N=2", p: 87 },
  { id: 16, a: "Стоимость", b: "Полное двоичное дерево", p: 77 },
  { id: 17, a: "Диаметр", b: "Решетка N=2", p: 31 },
  { id: 18, a: "Диаметр", b: "Полное двоичное дерево", p: 49 },
  { id: 19, a: "Ширина бисекции", b: "Решетка-тор N=2", p: 59 },
  { id: 20, a: "Стоимость", b: "Полносвязная", p: 83 },
  { id: 21, a: "Связность", b: "Гиперкуб", p: 74 },
  { id: 22, a: "Стоимость", b: "Гиперкуб", p: 103 },
  { id: 23, a: "Диаметр", b: "Кольцо", p: 97 },
  { id: 24, a: "Диаметр", b: "Линейная", p: 107 },
  { id: 25, a: "Стоимость", b: "Решетка N=2", p: 79 },
];

// Возвращает объект { value, formula, steps } где value — число, formula — строка формулы, steps — массив строк пояснений
function computeCharacteristic(topology, characteristic, p) {
  const steps = [];
  const isIntegerClose = (x) => Math.abs(x - Math.round(x)) < 1e-9;

  const sqrtP = Math.sqrt(p);
  const log2p = Math.log2(p);
  const log2pPlus1 = Math.log2(p + 1);

  const pushStep = (s) => steps.push(s);

  // Обработаем все топологии
  const topo = topology.toLowerCase();

  const result = { value: null, formula: "", steps: [] };

  // Helper to format numeric output nicely
  const fmt = (x) =>
    isFinite(x)
      ? (isIntegerClose(x) ? String(Math.round(x)) : Number(x.toFixed(6)).toString())
      : "NaN";

  if (topo.includes("полносвяз")) {
    // Fully connected
    if (characteristic === "Диаметр") {
      result.formula = "D = 1";
      result.value = 1;
      pushStep("Полносвязная: по определению диаметр = 1.");
    } else if (characteristic === "Ширина бисекции") {
      result.formula = "B = p / 2";
      result.value = p / 2;
      pushStep(`Ширина бисекции = p / 2 = ${p} / 2 = ${fmt(result.value)}`);
    } else if (characteristic === "Связность") {
      result.formula = "K = p - 1";
      result.value = p - 1;
      pushStep(`Связность = p - 1 = ${p} - 1 = ${fmt(result.value)}`);
    } else if (characteristic === "Стоимость") {
      result.formula = "C = p(p - 1) / 2";
      result.value = (p * (p - 1)) / 2;
      pushStep(`Стоимость (число дуг) = p(p - 1) / 2 = ${p}·${p - 1} / 2 = ${fmt(result.value)}`);
    }
  } else if (topo.includes("звезда")) {
    if (characteristic === "Диаметр") {
      result.formula = "D = 2";
      result.value = 2;
      pushStep("Звезда: диаметр = 2 (максимальный путь через центр).");
    } else if (characteristic === "Ширина бисекции") {
      result.formula = "B = 1";
      result.value = 1;
      pushStep("Звезда: ширина бисекции = 1 (удаление центра разделяет систему).");
    } else if (characteristic === "Связность") {
      result.formula = "K = 1";
      result.value = 1;
      pushStep("Звезда: связность = 1.");
    } else if (characteristic === "Стоимость") {
      result.formula = "C = p - 1";
      result.value = p - 1;
      pushStep(`Звезда: стоимость (число дуг) = p - 1 = ${fmt(result.value)}.`);
    }
  } else if (topo.includes("полное") && topo.includes("двоич")) {
    // Full binary tree
    if (characteristic === "Диаметр") {
      // D = 2 * log2(p+1)
      result.formula = "D = 2 * log2(p + 1)";
      result.value = 2 * log2pPlus1;
      pushStep(`Диаметр полного двоичного дерева: D = 2 * log2(p + 1).`);
      pushStep(`log2(p + 1) = log2(${p + 1}) = ${fmt(log2pPlus1)}.`);
      pushStep(`D = 2 * ${fmt(log2pPlus1)} = ${fmt(result.value)}.`);
    } else if (characteristic === "Ширина бисекции") {
      result.formula = "B = 1";
      result.value = 1;
      pushStep("Ширина бисекции для полного двоичного дерева принята равной 1.");
    } else if (characteristic === "Связность") {
      result.formula = "K = 1";
      result.value = 1;
      pushStep("Связность для полного двоичного дерева принята равной 1.");
    } else if (characteristic === "Стоимость") {
      result.formula = "C = p - 1";
      result.value = p - 1;
      pushStep(`Стоимость (число дуг) = p - 1 = ${fmt(result.value)}.`);
    }
  } else if (topo.includes("линей") || topo.includes("линия")) {
    if (characteristic === "Диаметр") {
      result.formula = "D = p - 1";
      result.value = p - 1;
      pushStep(`Линейная топология: D = p - 1 = ${fmt(result.value)}.`);
    } else if (characteristic === "Ширина бисекции") {
      result.formula = "B = 1";
      result.value = 1;
      pushStep("Ширина бисекции = 1.");
    } else if (characteristic === "Связность") {
      result.formula = "K = 1";
      result.value = 1;
      pushStep("Связность = 1.");
    } else if (characteristic === "Стоимость") {
      result.formula = "C = p - 1";
      result.value = p - 1;
      pushStep(`Стоимость = p - 1 = ${fmt(result.value)}.`);
    }
  } else if (topo.includes("кольц") || topo.includes("кольцо")) {
    if (characteristic === "Диаметр") {
      result.formula = "D = floor(p / 2)";
      result.value = Math.floor(p / 2);
      pushStep(`Кольцо: диаметр = floor(p/2) = floor(${p}/2) = ${fmt(result.value)}.`);
    } else if (characteristic === "Ширина бисекции") {
      result.formula = "B = 2";
      result.value = 2;
      pushStep("Кольцо: ширина бисекции = 2.");
    } else if (characteristic === "Связность") {
      result.formula = "K = 2";
      result.value = 2;
      pushStep("Кольцо: связность = 2.");
    } else if (characteristic === "Стоимость") {
      result.formula = "C = p";
      result.value = p;
      pushStep(`Стоимость = p = ${fmt(result.value)}.`);
    }
  } else if (topo.includes("решетка-тор") || topo.includes("решетка-тор n=2") || topo.includes("тор")) {
    // 2D torus
    if (characteristic === "Диаметр") {
      // D = 2 * floor(sqrt(p)/2)
      result.formula = "D = 2 * floor(sqrt(p) / 2)";
      const val = 2 * Math.floor(sqrtP / 2);
      result.value = val;
      pushStep(`Решетка-тор (2D): D = 2 * floor(sqrt(p) / 2).`);
      pushStep(`sqrt(p) = sqrt(${p}) = ${fmt(sqrtP)}; floor(sqrt(p)/2) = ${Math.floor(sqrtP / 2)}.`);
      pushStep(`D = 2 * ${Math.floor(sqrtP / 2)} = ${fmt(result.value)}.`);
    } else if (characteristic === "Ширина бисекции") {
      result.formula = "B = 2 * sqrt(p)";
      result.value = 2 * sqrtP;
      pushStep(`B = 2 * sqrt(p) = 2 * ${fmt(sqrtP)} = ${fmt(result.value)}.`);
    } else if (characteristic === "Связность") {
      result.formula = "K = 4";
      result.value = 4;
      pushStep("Связность (тор) = 4.");
    } else if (characteristic === "Стоимость") {
      result.formula = "C = 2 * p";
      result.value = 2 * p;
      pushStep(`Стоимость = 2 * p = ${2} * ${p} = ${fmt(result.value)}.`);
    }
  } else if (topo.includes("решетка n=2") || topo.includes("решетка n = 2") || topo.includes("решетка")) {
    // 2D mesh
    if (characteristic === "Диаметр") {
      result.formula = "D = 2 * (sqrt(p) - 1)";
      result.value = 2 * (sqrtP - 1);
      pushStep(`Решетка 2D: D = 2*(sqrt(p) - 1). sqrt(p) = ${fmt(sqrtP)}.`);
      pushStep(`D = 2*(${fmt(sqrtP)} - 1) = ${fmt(result.value)}.`);
    } else if (characteristic === "Ширина бисекции") {
      result.formula = "B = sqrt(p)";
      result.value = sqrtP;
      pushStep(`B = sqrt(p) = ${fmt(result.value)}.`);
    } else if (characteristic === "Связность") {
      result.formula = "K = 2";
      result.value = 2;
      pushStep("Связность = 2.");
    } else if (characteristic === "Стоимость") {
      result.formula = "C = 2p - 2*sqrt(p)";
      result.value = 2 * p - 2 * sqrtP;
      pushStep(`Стоимость = 2p - 2*sqrt(p) = 2*${p} - 2*${fmt(sqrtP)} = ${fmt(result.value)}.`);
    }
  } else if (topo.includes("гиперкуб") || topo.includes("гипер")) {
    // Hypercube: typically p = 2^k
    if (characteristic === "Диаметр") {
      result.formula = "D = log2(p)";
      result.value = log2p;
      pushStep(`Гиперкуб: диаметр = log2(p) = log2(${p}) = ${fmt(result.value)}.`);
      pushStep(
        "Примечание: для целого диаметра обычно ожидают p = 2^k; если p не степень 2, диаметр будет дробным (логарифм)."
      );
    } else if (characteristic === "Ширина бисекции") {
      result.formula = "B = p / 2";
      result.value = p / 2;
      pushStep(`B = p/2 = ${fmt(result.value)}.`);
    } else if (characteristic === "Связность") {
      result.formula = "K = log2(p)";
      result.value = log2p;
      pushStep(`Связность = log2(p) = ${fmt(result.value)}.`);
    } else if (characteristic === "Стоимость") {
      result.formula = "C = p * log2(p)";
      result.value = p * log2p;
      pushStep(`Стоимость = p * log2(p) = ${p} * ${fmt(log2p)} = ${fmt(result.value)}.`);
    }
  } else {
    result.formula = "—";
    result.value = NaN;
    pushStep("Топология не распознана — проверь название в варианте.");
  }

  result.steps = steps;
  return result;
}

const CounterTopology3 = () => {
  const [variantId, setVariantId] = useState(0);
  const [data, setData] = useState(variants[0]);
  const [result, setResult] = useState(null);

  const handleVariantChange = (e) => {
    const id = Number(e.target.value);
    const sel = variants.find((v) => v.id === id);
    setVariantId(id);
    setData(sel);
    setResult(null);
  };

  const handleFieldChange = (field, val) => {
    setData((prev) => ({ ...prev, [field]: field === "p" ? Number(val) : val }));
    setResult(null);
  };

  const calculate = () => {
    const res = computeCharacteristic(data.b, data.a, data.p);
    setResult(res);
  };

  const generateWord = async () => {
    if (!result) return;

    const headerRow = new DocxRow({
      children: [
        new DocxCell({ children: [new Paragraph("№ варианта")] }),
        new DocxCell({ children: [new Paragraph("a (характеристика)")] }),
        new DocxCell({ children: [new Paragraph("b (топология)")] }),
        new DocxCell({ children: [new Paragraph("p (серверов)")] }),
        new DocxCell({ children: [new Paragraph("Результат")] }),
      ],
    });

    const bodyRow = new DocxRow({
      children: [
        new DocxCell({ children: [new Paragraph(String(data.id))] }),
        new DocxCell({ children: [new Paragraph(data.a)] }),
        new DocxCell({ children: [new Paragraph(data.b)] }),
        new DocxCell({ children: [new Paragraph(String(data.p))] }),
        new DocxCell({ children: [new Paragraph(result.value !== null ? String(result.value) : "—") ] }),
      ],
    });

    const table = new DocxTable({ rows: [headerRow, bodyRow] });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: `Задача 3 (топологии) — Вариант ${data.id}`, bold: true })],
            }),
            new Paragraph(" "),
            new Paragraph("Исходные данные:"),
            new Paragraph(`a (характеристика) = ${data.a}`),
            new Paragraph(`b (топология) = ${data.b}`),
            new Paragraph(`p = ${data.p}`),
            new Paragraph(" "),
            new Paragraph("Таблица с результатом:"),
            table,
            new Paragraph(" "),
            new Paragraph("Пошаговые вычисления:"),
            ...result.steps.map((s) => new Paragraph(s)),
            new Paragraph(" "),
            new Paragraph(`Формула: ${result.formula}`),
            new Paragraph(`Результат: ${result.value}`),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Topology_Task3_Variant${data.id}.docx`);
  };

  // Helper to show value nicely
  const formatValue = (v) =>
    Number.isNaN(v) ? "—" : (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : Number(v.toFixed(6)).toString());

  return (
    <Paper sx={{ p: 3, maxWidth: 900, margin: "0 auto" }}>
      <Typography variant="h5" gutterBottom>
        Задача 3 — характеристики топологий (используем a и b из PDF)
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Вариант</InputLabel>
        <Select value={variantId} label="Вариант" onChange={handleVariantChange}>
          {variants.map((v) => (
            <MenuItem key={v.id} value={v.id}>
              Вариант {v.id} — {v.a} для {v.b} (p={v.p})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack spacing={2}>
        <TextField label="a (характеристика)" value={data.a} onChange={(e) => handleFieldChange("a", e.target.value)} />
        <TextField label="b (топология)" value={data.b} onChange={(e) => handleFieldChange("b", e.target.value)} />
        <TextField
          label="p (число серверов)"
          type="number"
          value={data.p}
          onChange={(e) => handleFieldChange("p", e.target.value)}
        />
      </Stack>

      <Button variant="contained" sx={{ mt: 3 }} onClick={calculate}>
        Рассчитать
      </Button>

      {result && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Пошаговое решение</Typography>

          <Typography sx={{ mt: 1 }}>
            <b>Исходные данные:</b> a = <b>{data.a}</b>, b = <b>{data.b}</b>, p = <b>{data.p}</b>
          </Typography>

          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell><b>A1</b></TableCell>
                <TableCell><b>A2</b></TableCell>
                <TableCell><b>Последовательный (формула)</b></TableCell>
                <TableCell><b>Параллельный (формула)</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* показываем как в методичке: просто статичная 4-строковая таблица T/T, T/F, F/T, F/F,
                  но для этой задачи основной результат — вычисление a по выбранной топологии */}
              <TableRow>
                <TableCell>T</TableCell>
                <TableCell>T</TableCell>
                <TableCell>{`T(A1)+T(A2)`}</TableCell>
                <TableCell>{data.b.toLowerCase().includes("дизъюнк") ? "max(T1,T2)" : "min(T1,T2)"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>T</TableCell>
                <TableCell>F</TableCell>
                <TableCell>{`T(A1)+T(A2)`}</TableCell>
                <TableCell>{data.b.toLowerCase().includes("дизъюнк") ? "max(T1,T2)" : "min(T1,T2)"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>F</TableCell>
                <TableCell>T</TableCell>
                <TableCell>{`T(A1)+T(A2)`}</TableCell>
                <TableCell>{data.b.toLowerCase().includes("дизъюнк") ? "max(T1,T2)" : "min(T1,T2)"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>F</TableCell>
                <TableCell>F</TableCell>
                <TableCell>{`T(A1)+T(A2)`}</TableCell>
                <TableCell>{data.b.toLowerCase().includes("дизъюнк") ? "max(T1,T2)" : "min(T1,T2)"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Шаги вычисления:</Typography>
            {result.steps.map((s, i) => (
              <Typography key={i} sx={{ mt: 0.5 }}>
                {i + 1}. {s}
              </Typography>
            ))}

            <Typography sx={{ mt: 1 }}>
              <b>Формула:</b> {result.formula}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <b>Результат:</b> {formatValue(result.value)}
            </Typography>
          </Box>

          <Button variant="outlined" sx={{ mt: 2 }} onClick={generateWord}>
            Скачать Word-файл
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default CounterTopology3;
