import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'lxgw-wenkai-screen-webfont/lxgwwenkaigbscreen.css';
import { App } from './App';
import { SNAP } from './render/env';
import './index.css';

if (SNAP) document.body.classList.add('snap');

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);
