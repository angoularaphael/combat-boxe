#!/usr/bin/env node
import { portraitsForNames } from './portraits-commons.mjs';

const extra = {
  'Saúl Álvarez': ['Canelo Álvarez', 'Canelo Alvarez', 'Saul Alvarez'],
  'Christian Mbilli': ['Christian Mbilli'],
  'Daniel Dubois': ['Daniel Dubois (boxer)'],
  'Fabio Wardley': ['Fabio Wardley'],
  'Emanuel Navarrete': ['Emanuel Navarrete'],
  "O'Shaquie Foster": ["O'Shaquie Foster"],
  'Floyd Schofield III': ['Floyd Schofield', 'Floyd Schofield (boxer)'],
  'Lucas Bahdi': ['Lucas Bahdi'],
  'Osleys Iglesias': ['Osleys Iglesias'],
  'Oliver Zaren': ['Oliver Zaren'],
  'Sebastian Fundora': ['Sebastian Fundora'],
  'Ermal Hadribeaj': ['Ermal Hadribeaj'],
  'Dalton Smith': ['Dalton Smith (boxer)'],
  'Alberto Puello': ['Alberto Puello'],
  'Brice Clavier': ['Brice Clavier'],
  'Gaëtan Ntambwe': ['Gaetan Ntambwe', 'Gaëtan Ntambwe'],
  'Marina Sakharov': ['Marina Sakharov', 'Marina Sakharova'],
  'Isis Logerie': ['Isis Logerie'],
  'Makan Traoré': ['Makan Traoré', 'Makan Traore'],
  'Yamin Bartolo': ['Yamin Bartolo'],
  'Hassana El Qadmi': ['Hassana El Qadmi'],
  'Luka Keinashvili': ['Luka Keinashvili'],
  'Ephrem Bariko': ['Ephrem Bariko'],
  'Maloway Canlers': ['Maloway Canlers'],
  'Hadria Bader': ['Hadria Bader'],
};

const names = process.argv.slice(2);
const list = names.length ? names : Object.keys(extra);
const rows = await portraitsForNames(list, extra);
console.log('OK', rows.length, 'portraits');
