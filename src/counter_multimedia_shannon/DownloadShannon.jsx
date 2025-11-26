import { Button, Paper, TextField, Typography, Box, Table, TableHead, TableBody, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";

function countLetters(str) {
  const result = {};
  const regex = /[а-яё ]/i;

  for (const char of str.toLowerCase()) {
    if (regex.test(char)) {
      result[char] = (result[char] || 0) + 1;
    }
  }

  const sorted = Object.entries(result).map((item) => ([...item, []]))
    .sort((a, b) => {
      const [charA, countA] = a;
      const [charB, countB] = b;

      // 1. Сортировка по частоте (убывание)
      if (countB !== countA) {
        return countB - countA;
      }

      // 2. Если частоты равны — пробел должен быть раньше букв
      const isSpaceA = charA === " ";
      const isSpaceB = charB === " ";
      if (isSpaceA && !isSpaceB) return -1;
      if (!isSpaceA && isSpaceB) return 1;

      // 3. Алфавитная сортировка букв
      return charA.localeCompare(charB, "ru");
    });

  return sorted;
}

function buildCodes(simbols) {
  const findGroup = (group) => {
    if (group.length === 2) {
      group[0][2].push(0)
      group[1][2].push(1)
      return
    }
    let total = group.reduce((sum, s) => sum + s[1], 0);
    let half = (total / 2);
    let amount = 0
    let leftGroup = []
    let rightGroup = []
    // console.log("group", group)
    for (let i in group) {
      amount = amount + group[i][1]
      if (amount >= half) {
        group[i][2].push(1)
        rightGroup.push(group[i])
      } else {
        group[i][2].push(0)
        leftGroup.push(group[i])
      }
    }
    // console.log("leftGroup", leftGroup, leftGroup.length)
    // console.log("rightGroup", rightGroup)
    if (leftGroup.length > 1) {
      findGroup(leftGroup)
    }
    if (rightGroup.length > 1) {
      findGroup(rightGroup)
    }
  }
  findGroup(simbols)
  return simbols
}

// function buildCodes(symbols) {
//   // Инициализация кода для каждого символа
//   for (let s of symbols) {
//     s.push([]); // symbols[i] = [char, count, codeArray]
//   }

//   const build = (group) => {
//     if (group.length <= 1) return; // если в группе один символ, дальше не делим

//     // Сумма всех частот в группе
//     let total = group.reduce((sum, s) => sum + s[1], 0);
//     let half = Math.floor(total / 2); // максимальная сумма для 0 группы

//     let sumSoFar = 0;
//     let splitIndex = 0;

//     // Ищем точку перехода
//     for (let i = 0; i < group.length; i++) {
//       sumSoFar += group[i][1];
//       if (sumSoFar > half) { // как только превышаем половину
//         splitIndex = i;
//         break;
//       }
//     }

//     // Присваиваем коды
//     for (let i = 0; i < group.length; i++) {
//       if (i < splitIndex) {
//         group[i][2].push(0);
//       } else {
//         group[i][2].push(1);
//       }
//     }

//     // Рекурсивно строим подгруппы
//     const leftGroup = group.slice(0, splitIndex);
//     const rightGroup = group.slice(splitIndex);

//     if (leftGroup.length > 2) build(leftGroup);
//     if (rightGroup.length > 2) build(rightGroup);

//     if (leftGroup.length === 2) {
//       leftGroup[0][2].push(0)
//       leftGroup[1][2].push(1)
//     }
//     if (rightGroup.length === 2) {
//       rightGroup[0][2].push(0)
//       rightGroup[1][2].push(1)
//     }
//   };

//   build(symbols);

//   // Преобразуем массив кодов в строку
//   return symbols.map(([char, count, codeArr]) => ({
//     char,
//     count,
//     code: codeArr.join("")
//   }));
// }
// function buildCodes(symbols) {
//   for (let s of symbols) {
//     s.push([]); // symbols[i] = [char, count, codeArray]
//   }

//   const stack = [{ group: symbols, prefix: [] }];

//   while (stack.length > 0) {
//     const { group, prefix } = stack.pop();

//     if (group.length === 1) {
//       group[0][2] = [...prefix];
//       continue;
//     }

//     // считаем точку деления
//     const total = group.reduce((sum, s) => sum + s[1], 0);
//     const half = Math.floor(total / 2);

//     let sumSoFar = 0;
//     let splitIndex = 0;

//     for (let i = 0; i < group.length; i++) {
//       sumSoFar += group[i][1];
//       if (sumSoFar > half) { // текущий символ переходит в правую группу
//         splitIndex = i;
//         break;
//       }
//     }

//     const left = group.slice(0, splitIndex);
//     const right = group.slice(splitIndex);

//     // присваиваем текущий бит
//     left.forEach(s => s[2].push(0));
//     right.forEach(s => s[2].push(1));

//     // добавляем подгруппы в стек только если длина > 1
//     if (left.length > 1) stack.push({ group: left, prefix: [...prefix, 0] });
//     if (right.length > 1) stack.push({ group: right, prefix: [...prefix, 1] });
//   }

//   return symbols.map(([char, count, codeArr]) => ({
//     char,
//     count,
//     code: codeArr.join("")
//   }));
// }



const DownloadShannon = () => {
  const [str, setStr] = useState("ИИИИИИИИЕЕЕЕЕ         АААВВВМММЛЛООППРРТТХХДКНСЧЫ")
  const [data, setData] = useState(null)
  const handleDownload = () => {
    const fileUrl = `/shannon.pdf`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "shannon.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const count = () => {
    const sorted = countLetters(str);
    const codes = buildCodes(sorted);
    let longest = 0
    const strCodes = codes.map((item => {
      const code = item[2].join("")
      if (longest < code.length) {
        longest = code.length
      }
      return ([item[0], item[1], code])
    }))
    setData({
      treeLength: longest,
      treeHeader: new Array(longest).fill(null),
      symbols: strCodes
    })
  }

  return (
    <>
      <Paper sx={{ margin: [4, 20,], padding: 4 }}>
        <Typography>
          Сори, но это долго кодить, так что вот инструкция для экселя
        </Typography>
        <Button onClick={handleDownload} variant="contained">Download</Button>
        <Box sx={{ marginTop: 2 }}>
          <TextField
            label="Строка" value={str}
            onChange={(e) => setStr(e.target.value)}
            sx={{ width: "100%" }}
          />
        </Box>
        <Button sx={{ marginTop: 2 }} onClick={count} variant="contained">Рассчитать</Button>
        {data &&
          <>
            <Table size="small" sx={{ marginTop: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Символ</TableCell>
                  <TableCell>Кол-во</TableCell>
                  {data.treeHeader.map((_, index) => {
                    return (
                      <TableCell key={index}>
                        Уровень {index + 1}
                      </TableCell>
                    )
                  })}
                  <TableCell>
                    Код
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.symbols.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{item[0] === " " ? "ПРОБЕЛ" : item[0]}</TableCell>
                      <TableCell>{item[1]}</TableCell>
                      {data.treeHeader.map((_, codeIndex) => {
                        return (
                          <TableCell sx={{ background: item[2][codeIndex] === "1" ? "#aad2f1" : "", borderLeft: "1px solid black" }} key={codeIndex}>{item[2][codeIndex]}</TableCell>
                        )
                      })}
                      <TableCell>
                        {item[2]}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </>
        }

      </Paper>
    </>
  );
};
export default DownloadShannon;
