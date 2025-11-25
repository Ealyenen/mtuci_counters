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

// ====== Таблица вариантов (Задача 4) ======
const variants = [
    { id: 1, m: 640, n: 480, V: 300.0 },
    { id: 2, m: 1600, n: 900, V: 879.0 },
    { id: 3, m: 320, n: 240, V: 150.0 },
    { id: 4, m: 1200, n: 900, V: 791.1 },
    { id: 5, m: 512, n: 256, V: 256.0 },
    { id: 6, m: 128, n: 130, V: 32.5 },
    { id: 7, m: 600, n: 1000, V: 659.2 },
    { id: 8, m: 1600, n: 1200, V: 939.0 },
    { id: 9, m: 512, n: 512, V: 192.0 },
    { id: 10, m: 1024, n: 1024, V: 512.0 },
    { id: 11, m: 1200, n: 768, V: 900.0 },
    { id: 12, m: 160, n: 128, V: 40.0 },
    { id: 13, m: 250, n: 300, V: 137.4 },
    { id: 14, m: 800, n: 600, V: 586.0 },
    { id: 15, m: 600, n: 400, V: 175.8 },
    { id: 16, m: 128, n: 320, V: 40.0 },
    { id: 17, m: 768, n: 602, V: 451.5 },
    { id: 18, m: 640, n: 321, V: 376.2 },
    { id: 19, m: 640, n: 320, V: 400.0 },
    { id: 20, m: 512, n: 301, V: 131.7 },
    { id: 21, m: 640, n: 384, V: 390.0 },
    { id: 22, m: 256, n: 192, V: 18.0 },
    { id: 23, m: 1200, n: 1024, V: 900.0 },
    { id: 24, m: 600, n: 400, V: 293.0 },
    { id: 25, m: 1024, n: 600, V: 600.0 },
];

// ====== Компонент ======
const CounterColors4 = () => {
    const [variant, setVariant] = useState(1);
    const [data, setData] = useState(variants[0]);
    const [result, setResult] = useState(null);

    const handleVariantChange = (event) => {
        const selected = variants.find((v) => v.id === Number(event.target.value));
        if (selected) {
            setVariant(selected.id);
            setData(selected);
            setResult(null);
        }
    };

    const handleChange = (field, value) => {
        setData((prev) => ({ ...prev, [field]: Number(value) }));
    };

    const calculate = () => {
        const { m, n, V } = data;

        // 1) переводим в биты
        const V_bytes = V * 1024; // Кбайт -> байт
        const V_bits = V_bytes * 8; // байт -> биты

        // 2) число пикселей
        const pixels = m * n;

        // 3) code (бит/пиксель) — дробное значение возможно
        const code = V_bits / pixels; // биты на пиксель (может быть дробным)

        // 4) вычисляем 2^code (реальное число оттенков, может быть дробным)
        const pow2 = Math.pow(2, code);

        // 5) максимально возможное целое число цветов — целая часть 2^code
        const k = Math.floor(pow2);

        // 6) полезно вычислить ещё: целая часть code (целых битов) и остаток (для пояснений)
        const codeInt = Math.floor(code);
        const codeFrac = code - codeInt;

        setResult({
            V_bytes,
            V_bits,
            pixels,
            code,
            codeInt,
            codeFrac,
            pow2,
            k,
        });
    };

    // генерация Word с пошаговыми расчётами
    const generateWord = async () => {
        if (!result) return;
        const { m, n, V } = data;
        const {
            V_bytes,
            V_bits,
            pixels,
            code,
            codeInt,
            codeFrac,
            pow2,
            k,
        } = result;

        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({ text: "Задача 4. Максимальное число цветов", bold: true }),
                            ],
                        }),
                        new Paragraph(" "),
                        new Paragraph("Исходные данные:"),
                        new Paragraph(`Размер изображения: ${m} × ${n} пикселей`),
                        new Paragraph(`Объём файла: ${V} Кбайт`),
                        new Paragraph(" "),
                        new Paragraph("Шаг 1. Перевод объёма в байты и биты:"),
                        new Paragraph(`V_bytes = ${V} × 1024 = ${V_bytes.toFixed(0)} байт`),
                        new Paragraph(`V_bits = V_bytes × 8 = ${V_bits.toFixed(0)} бит`),
                        new Paragraph(" "),
                        new Paragraph("Шаг 2. Пикселей:"),
                        new Paragraph(`pixels = m × n = ${m} × ${n} = ${pixels}`),
                        new Paragraph(" "),
                        new Paragraph("Шаг 3. Бит на пиксель (code):"),
                        new Paragraph(`code = V_bits / pixels = ${V_bits.toFixed(0)} / ${pixels} = ${code.toFixed(6)} (бит/пиксель)`),
                        new Paragraph(" "),
                        new Paragraph("Шаг 4. Реальное число оттенков = 2^code:"),
                        new Paragraph(`2^code = 2^${code.toFixed(6)} ≈ ${pow2.toFixed(6)}`),
                        new Paragraph(" "),
                        new Paragraph("Шаг 5. Максимально возможное целое число цветов (целая часть):"),
                        new Paragraph(`k = floor(2^code) = ${k}`),
                    ],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `Задача4_Вариант${variant}.docx`);
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 760, margin: "0 auto" }}>
            <Typography variant="h5" gutterBottom>
                Задача 4. Максимальное число цветов изображения
            </Typography>

            <Typography variant="body2" sx={{ mb: 2 }}>
                Условие и таблица вариантов — из PDF.
                Локальный файл: <code>/mnt/data/МИС Задача 4 ЦЗОПБ.pdf</code>.
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
                <TextField label="m (ширина)" type="number" value={data.m} onChange={(e) => handleChange("m", e.target.value)} />
                <TextField label="n (высота)" type="number" value={data.n} onChange={(e) => handleChange("n", e.target.value)} />
                <TextField label="V (Кбайт)" type="number" value={data.V} onChange={(e) => handleChange("V", e.target.value)} />
            </Stack>

            <Button variant="contained" sx={{ mt: 3 }} onClick={calculate}>
                Рассчитать
            </Button>

            {result && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Решение</Typography>

                    <Typography sx={{ mt: 1 }}>
                        <strong>Шаг 1 — перевод объёма:</strong><br />
                        V_bytes = {data.V} × 1024 = {result.V_bytes.toFixed(0)} байт<br />
                        V_bits = V_bytes × 8 = {result.V_bits.toFixed(0)} бит
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                        <strong>Шаг 2 — число пикселей:</strong><br />
                        pixels = m × n = {data.m} × {data.n} = {result.pixels}
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                        <strong>Шаг 3 — биты на пиксель (code):</strong><br />
                        code = V_bits / pixels = {result.V_bits.toFixed(0)} / {result.pixels} = {result.code.toFixed(6)} бит/пиксель
                        <br />
                        (целая часть: {result.codeInt}, дробная часть: {result.codeFrac.toFixed(6)})
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                        <strong>Шаг 4 — реальное число оттенков:</strong><br />
                        2<Span top>{result.code.toFixed(6)}</Span> = {result.pow2.toFixed(6)}
                        {Number.isInteger(result.code) ? (
                            <><br />поскольку code целое ({result.codeInt}), можно записать 2^{result.codeInt} = {result.pow2.toFixed(0)}</>
                        ) : null}
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                        <strong>Шаг 5 — максимальное целое число цветов:</strong><br />
                        k = floor(2^code) = floor({result.pow2.toFixed(6)}) = <strong>{result.k.toLocaleString()}</strong>
                    </Typography>

                    {/* <Typography sx={{ mt: 2, color: "text.secondary" }}>
                        Примечание: мы считаем, что коды пикселей записываются подряд без заголовков
                        и без сжатия; всё соответствует методике в PDF.
                    </Typography> */}

                    <Button variant="outlined" sx={{ mt: 2 }} onClick={generateWord}>
                        Скачать Word
                    </Button>
                </Box>
            )}
        </Paper>
    );
};

export default CounterColors4;
