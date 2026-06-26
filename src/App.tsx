/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Code, 
  Layout, 
  Info, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  Terminal, 
  ArrowRight, 
  Sparkles, 
  Globe, 
  FileCode, 
  Network,
  Check,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { htmlCode, jsCode, execSteps, ExecStep } from './codeSnippets';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'js' | 'html' | 'guide'>('js');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(["[DOM] Documento carregado. Aguardando execução do script..."]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play control logic
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= execSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Log update when step changes
  useEffect(() => {
    let newLogs: string[] = [];
    switch (currentStep) {
      case 0:
        newLogs = [
          "[DOM] DOM carregado de index.html.",
          "[DOM] h1#titulo está vazio.",
          "[DOM] ul está vazia.",
          "[DOM] a está vazia (com href=https://prozeducacao.com.br).",
          "[DOM] ol#lista-ordenada está vazia."
        ];
        break;
      case 1:
        newLogs = [
          "[JS] Carregando script.js...",
          "[JS] const titulo = document.getElementById('titulo') -> Selecionado!",
          "[JS] const listaNaoOrdenada = document.querySelector('ul') -> Selecionado!",
          "[JS] const link = document.querySelector('a') -> Selecionado!",
          "[JS] const listaOrdenada = document.getElementById('lista-ordenada') -> Selecionado!"
        ];
        break;
      case 2:
        newLogs = [
          "[JS] Executando manipulação de texto (.innerText):",
          "[DOM] titulo.innerText = 'Bem-vindo ao Projeto!' -> Sucesso!",
          "[DOM] link.innerText = 'Visite a Proz Educação' -> Sucesso!"
        ];
        break;
      case 3:
        newLogs = [
          "[JS] Injetando estrutura via (.innerHTML):",
          "[DOM] listaNaoOrdenada.innerHTML = ... -> Injetados 3 itens na lista não ordenada."
        ];
        break;
      case 4:
        newLogs = [
          "[JS] Injetando links via (.innerHTML):",
          "[DOM] listaOrdenada.innerHTML = ... -> Injetados 3 links interativos na lista ordenada.",
          "[System] Execução concluída com sucesso! 🎉"
        ];
        break;
    }
    setLogs(newLogs);
  }, [currentStep]);

  const handleStepSelect = (index: number) => {
    setIsPlaying(false);
    setCurrentStep(index);
  };

  const nextStep = () => {
    setIsPlaying(false);
    if (currentStep < execSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setIsPlaying(false);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetAll = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const currentStepInfo = execSteps[currentStep];

  // Helper values representing DOM State depending on step
  const getDOMState = () => {
    const hasCaptured = currentStep >= 1;
    const hasText = currentStep >= 2;
    const hasUnorderedList = currentStep >= 3;
    const hasOrderedList = currentStep >= 4;

    return {
      hasCaptured,
      tituloText: hasText ? "Bem-vindo ao Projeto!" : "",
      linkText: hasText ? "Visite a Proz Educação" : "",
      unorderedItems: hasUnorderedList ? ["Item simples 1", "Item simples 2", "Item simples 3"] : [],
      orderedItems: hasOrderedList ? [
        { label: "Google", url: "https://www.google.com" },
        { label: "GitHub", url: "https://www.github.com" },
        { label: "Wikipedia", url: "https://www.wikipedia.org" }
      ] : []
    };
  };

  const domState = getDOMState();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col antialiased">
      {/* Header Banner */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-12 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#E0F2FE] text-[#0284C7] text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Proz Educação • Prática
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> DOM Explorer
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <Network className="text-sky-600 w-8 h-8 shrink-0" />
              Conexão HTML & JavaScript
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Acompanhe visualmente como o código JavaScript captura, edita e constrói elementos dinâmicos na árvore do DOM.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            {/* Playback Controls */}
            <div className="flex items-center bg-slate-100 p-1.5 rounded-lg border border-slate-200">
              <button 
                id="btn-prev"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="p-2 rounded-md hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                title="Passo Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                id="btn-toggle-play"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-medium text-xs transition-all ${
                  isPlaying 
                    ? 'bg-[#F43F5E] text-white shadow-xs' 
                    : 'bg-white hover:bg-slate-50 shadow-xs text-slate-700'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Reproduzir
                  </>
                )}
              </button>

              <button 
                id="btn-next"
                onClick={nextStep}
                disabled={currentStep === execSteps.length - 1}
                className="p-2 rounded-md hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                title="Próximo Passo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>

              <button
                id="btn-reset"
                onClick={resetAll}
                className="p-2 rounded-md hover:bg-white text-slate-500 hover:text-slate-900 transition-all"
                title="Reiniciar Simulação"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Code, Selector, or Guide Column */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Timeline Steps Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 bg-emerald-100 rounded-full p-0.5" />
              Linha do Tempo de Execução
            </h2>
            <div className="relative flex flex-col gap-2">
              {execSteps.map((step, idx) => {
                const isActive = idx === currentStep;
                const isPassed = idx < currentStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepSelect(idx)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 relative overflow-hidden ${
                      isActive 
                        ? 'bg-[#E0F2FE]/50 border-sky-300 text-sky-950 shadow-xs' 
                        : isPassed 
                        ? 'bg-emerald-50/20 border-slate-200 text-slate-600 hover:bg-slate-50'
                        : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Step indicator dot/icon */}
                    <div className="mt-0.5 shrink-0">
                      {isPassed ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      ) : (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                          isActive ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold tracking-wide uppercase ${
                        isActive ? 'text-sky-700' : isPassed ? 'text-emerald-700' : 'text-slate-400'
                      }`}>
                        {step.title}
                      </p>
                      {isActive && (
                        <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="bg-slate-900 text-slate-100 rounded-xl overflow-hidden border border-slate-800 shadow-md flex flex-col">
            <div className="flex items-center justify-between px-4 bg-slate-950 border-b border-slate-800 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span>
                <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
                <span className="text-xs text-slate-400 font-mono ml-2">editor_workspace</span>
              </div>
              <div className="flex gap-1 p-0.5 bg-slate-900 rounded-md">
                <button
                  onClick={() => setActiveTab('js')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                    activeTab === 'js' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" /> script.js
                </button>
                <button
                  onClick={() => setActiveTab('html')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                    activeTab === 'html' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" /> index.html
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                    activeTab === 'guide' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" /> Guia
                </button>
              </div>
            </div>

            {/* Code Body Content */}
            <div className="p-4 font-mono text-xs overflow-x-auto min-h-[300px] max-h-[460px] leading-relaxed">
              {activeTab === 'js' && (
                <div className="relative">
                  {jsCode.split('\n').map((line, idx) => {
                    const lineNum = idx + 1;
                    const isHighlighted = currentStepInfo.jsLines.includes(lineNum);
                    return (
                      <div 
                        key={idx} 
                        className={`flex gap-4 -mx-4 px-4 py-0.5 transition-colors ${
                          isHighlighted ? 'bg-sky-950/75 border-l-4 border-sky-500 text-sky-200 font-medium' : 'text-slate-300'
                        }`}
                      >
                        <span className="w-6 text-slate-600 text-right select-none pr-1">{lineNum}</span>
                        <span className="whitespace-pre">{line}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'html' && (
                <div>
                  {htmlCode.split('\n').map((line, idx) => {
                    const lineNum = idx + 1;
                    
                    // Highlight source HTML tags based on step target elements
                    let hasHighlight = false;
                    if (currentStepInfo.htmlTargetIds.includes('titulo') && line.includes('id="titulo"')) hasHighlight = true;
                    if (currentStepInfo.htmlTargetIds.includes('ul') && line.includes('<ul>')) hasHighlight = true;
                    if (currentStepInfo.htmlTargetIds.includes('a') && line.includes('<a href')) hasHighlight = true;
                    if (currentStepInfo.htmlTargetIds.includes('lista-ordenada') && line.includes('id="lista-ordenada"')) hasHighlight = true;

                    return (
                      <div 
                        key={idx} 
                        className={`flex gap-4 -mx-4 px-4 py-0.5 transition-all ${
                          hasHighlight ? 'bg-amber-950/75 border-l-4 border-amber-500 text-amber-200 font-medium' : 'text-slate-300'
                        }`}
                      >
                        <span className="w-6 text-slate-600 text-right select-none pr-1">{lineNum}</span>
                        <span className="whitespace-pre">{line}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'guide' && (
                <div className="font-sans text-sm text-slate-300 space-y-4">
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <h3 className="text-white font-semibold flex items-center gap-2 mb-1">
                      💡 O que este projeto ensina?
                    </h3>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Este exercício prático demonstra o ciclo básico de um desenvolvedor front-end: interligar elementos estáticos descritos em arquivos HTML com o comportamento lógico dinâmico do JavaScript.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white font-medium text-xs uppercase tracking-wide text-slate-400">Conceitos Chave</h4>
                    <div className="grid gap-2 text-xs">
                      <div className="p-2.5 bg-slate-950 rounded-md border border-slate-800">
                        <strong className="text-sky-400">Captura de Elementos (DOM API):</strong>
                        <p className="text-slate-400 mt-1">Métodos como <code>getElementById()</code> e <code>querySelector()</code> buscam tags na página para podermos manipulá-las.</p>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-md border border-slate-800">
                        <strong className="text-[#38BDF8]">Propriedade .innerText:</strong>
                        <p className="text-slate-400 mt-1">Segura para adicionar texto puro. Trata o conteúdo estritamente como caracteres visíveis sem renderizar tags.</p>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-md border border-slate-800">
                        <strong className="text-amber-400">Propriedade .innerHTML:</strong>
                        <p className="text-slate-400 mt-1">Interpreta strings que contêm marcações, gerando dinamicamente novas tags filhas como <code>&lt;li&gt;</code> e <code>&lt;a&gt;</code>.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Developer Tools Pseudo-Console */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xs">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <Terminal className="w-3.5 h-3.5 text-[#F43F5E]" />
              <span>Console do Desenvolvedor</span>
            </div>
            <div className="p-3 font-mono text-[11px] space-y-1.5 text-[#34D399] max-h-[140px] overflow-y-auto">
              {logs.map((log, index) => {
                let colorClass = "text-[#34D399]"; // Default DOM action green
                if (log.startsWith("[JS]")) colorClass = "text-sky-400";
                if (log.startsWith("[System]")) colorClass = "text-yellow-400 font-semibold";
                return (
                  <div key={index} className={`flex gap-1 items-start ${colorClass}`}>
                    <span className="text-slate-600 select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Visualizer and Inspector */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* Browser Viewport Box */}
          <div className="bg-white rounded-xl border-2 border-slate-300 shadow-md overflow-hidden flex flex-col">
            {/* Browser Header Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
              </div>
              <div className="flex-1 max-w-md mx-4 bg-white border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-500 font-mono flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">https://cleidelarrissasharra.github.io/conexao-dom/</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block"></div>
                <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Live</span>
              </div>
            </div>

            {/* Dynamic viewport renderer window */}
            <div className="p-8 md:p-12 min-h-[340px] bg-white flex flex-col justify-center relative">
              
              {/* Highlight targets according to current step */}
              <div className="space-y-6 max-w-2xl mx-auto w-full relative">
                
                {/* Element 1: Title */}
                <div className={`relative p-3 rounded-lg transition-all ${
                  currentStepInfo.htmlTargetIds.includes('titulo')
                    ? 'ring-2 ring-sky-500 bg-sky-50/50 scale-[1.01]'
                    : selectedNode === 'h1' ? 'ring-2 ring-slate-400 bg-slate-50' : 'hover:bg-slate-50/50'
                }`}>
                  {/* Selector Badge Indicator */}
                  <span className="absolute -top-3.5 right-2 bg-sky-600 text-white font-mono text-[9px] px-2 py-0.5 rounded-md shadow-xs opacity-85">
                    h1#titulo
                  </span>

                  {domState.tituloText ? (
                    <motion.h1 
                      id="titulo"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl md:text-3.5xl font-display font-bold text-slate-900 tracking-tight"
                    >
                      {domState.tituloText}
                    </motion.h1>
                  ) : (
                    <div className="py-2 flex items-center gap-2 border-b-2 border-dashed border-slate-200 text-slate-300 italic text-sm">
                      <span className="font-mono text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">&lt;h1#titulo&gt;</span> 
                      Vazio (Invisível no HTML original)
                    </div>
                  )}
                </div>

                {/* Element 2: Unordered list */}
                <div className={`relative p-3 rounded-lg transition-all ${
                  currentStepInfo.htmlTargetIds.includes('ul')
                    ? 'ring-2 ring-emerald-500 bg-emerald-50/50 scale-[1.01]'
                    : selectedNode === 'ul' ? 'ring-2 ring-slate-400 bg-slate-50' : 'hover:bg-slate-50/50'
                }`}>
                  <span className="absolute -top-3.5 right-2 bg-emerald-600 text-white font-mono text-[9px] px-2 py-0.5 rounded-md shadow-xs opacity-85">
                    ul
                  </span>

                  {domState.unorderedItems.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                      <AnimatePresence>
                        {domState.unorderedItems.map((item, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-sm font-medium hover:text-emerald-700 transition-colors"
                          >
                            {item}
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  ) : (
                    <div className="py-2 flex items-center gap-2 border-b-2 border-dashed border-slate-200 text-slate-300 italic text-sm">
                      <span className="font-mono text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">&lt;ul&gt;</span> 
                      Vazio (Invisível no HTML original)
                    </div>
                  )}
                </div>

                {/* Element 3: Anchor Link */}
                <div className={`relative p-3 rounded-lg transition-all ${
                  currentStepInfo.htmlTargetIds.includes('a')
                    ? 'ring-2 ring-indigo-500 bg-indigo-50/50 scale-[1.01]'
                    : selectedNode === 'a' ? 'ring-2 ring-slate-400 bg-slate-50' : 'hover:bg-slate-50/50'
                }`}>
                  <span className="absolute -top-3.5 right-2 bg-indigo-600 text-white font-mono text-[9px] px-2 py-0.5 rounded-md shadow-xs opacity-85">
                    a
                  </span>

                  {domState.linkText ? (
                    <motion.a 
                      href="https://prozeducacao.com.br" 
                      target="_blank" 
                      rel="noreferrer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-800 hover:underline font-semibold text-sm"
                    >
                      {domState.linkText} <ExternalLink className="w-3.5 h-3.5" />
                    </motion.a>
                  ) : (
                    <div className="py-2 flex items-center gap-2 border-b-2 border-dashed border-slate-200 text-slate-300 italic text-sm">
                      <span className="font-mono text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">&lt;a href="..."&gt;</span>
                      Sem conteúdo de texto (Invisível)
                    </div>
                  )}
                </div>

                {/* Element 4: Ordered list */}
                <div className={`relative p-3 rounded-lg transition-all ${
                  currentStepInfo.htmlTargetIds.includes('lista-ordenada')
                    ? 'ring-2 ring-purple-500 bg-purple-50/50 scale-[1.01]'
                    : selectedNode === 'ol' ? 'ring-2 ring-slate-400 bg-slate-50' : 'hover:bg-slate-50/50'
                }`}>
                  <span className="absolute -top-3.5 right-2 bg-purple-600 text-white font-mono text-[9px] px-2 py-0.5 rounded-md shadow-xs opacity-85">
                    ol#lista-ordenada
                  </span>

                  {domState.orderedItems.length > 0 ? (
                    <ol className="list-decimal pl-5 space-y-2 text-slate-700">
                      <AnimatePresence>
                        {domState.orderedItems.map((item, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-sm font-medium"
                          >
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1"
                            >
                              {item.label} <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ol>
                  ) : (
                    <div className="py-2 flex items-center gap-2 border-b-2 border-dashed border-slate-200 text-slate-300 italic text-sm">
                      <span className="font-mono text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">&lt;ol#lista-ordenada&gt;</span> 
                      Vazio (Invisível no HTML original)
                    </div>
                  )}
                </div>

              </div>

              {/* DOM Connection Visual Aid Overlays */}
              <AnimatePresence>
                {currentStep === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/10 backdrop-blur-xs flex items-center justify-center p-4 pointer-events-none"
                  >
                    <div className="bg-slate-950 text-white p-4 rounded-xl border border-slate-800 shadow-2xl max-w-sm pointer-events-auto">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Terminal className="text-sky-400 w-4.5 h-4.5" />
                        <span className="font-semibold text-xs uppercase tracking-wide text-sky-400">Captura de Nós</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        As variáveis no JS criaram referências reais para os nós da árvore DOM. O HTML e o JavaScript estão oficialmente interligados na memória do navegador!
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Interactive DOM Tree Inspector (DevTools Style) */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300 font-mono flex items-center gap-1.5">
                <Network className="w-4 h-4 text-sky-400" />
                Árvore de Elementos do DOM (DOM Tree)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Clique nos elementos para inspecionar</span>
            </div>
            
            <div className="p-4 font-mono text-xs text-slate-300 space-y-2 select-none overflow-x-auto">
              
              {/* HTML node */}
              <div className="pl-0">
                <span className="text-[#E06C75]">&lt;html</span> <span className="text-[#D19A66]">lang</span>=<span className="text-[#98C379]">"pt-BR"</span><span className="text-[#E06C75]">&gt;</span>
              </div>

              {/* Head node */}
              <div className="pl-4 text-slate-500">
                <span>&lt;head&gt; ... &lt;/head&gt;</span>
              </div>

              {/* Body node */}
              <div className="pl-4">
                <span className="text-[#E06C75]">&lt;body&gt;</span>
              </div>

              {/* h1 node */}
              <div 
                className={`pl-8 py-1 rounded transition-colors cursor-pointer flex items-center gap-2 ${
                  selectedNode === 'h1' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/40'
                }`}
                onClick={() => setSelectedNode(selectedNode === 'h1' ? null : 'h1')}
              >
                <span className="text-[#E06C75]">&lt;h1</span> <span className="text-[#D19A66]">id</span>=<span className="text-[#98C379]">"titulo"</span><span className="text-[#E06C75]">&gt;</span>
                <span className="text-slate-100 max-w-[200px] truncate">{domState.tituloText || ""}</span>
                <span className="text-[#E06C75]">&lt;/h1&gt;</span>
                {currentStepInfo.htmlTargetIds.includes('titulo') && (
                  <span className="ml-auto text-[10px] bg-sky-500 text-white px-1.5 py-0.2 rounded font-sans scale-90">Modificado</span>
                )}
              </div>

              {/* ul node */}
              <div 
                className={`pl-8 py-1 rounded transition-colors cursor-pointer ${
                  selectedNode === 'ul' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/40'
                }`}
                onClick={() => setSelectedNode(selectedNode === 'ul' ? null : 'ul')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#E06C75]">&lt;ul&gt;</span>
                  {currentStepInfo.htmlTargetIds.includes('ul') && (
                    <span className="ml-auto text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded font-sans scale-90">Injetado</span>
                  )}
                </div>
                {domState.unorderedItems.length > 0 && (
                  <div className="pl-4 border-l border-slate-700 my-1 space-y-0.5">
                    {domState.unorderedItems.map((item, idx) => (
                      <div key={idx}>
                        <span className="text-[#E06C75]">&lt;li&gt;</span>
                        <span className="text-slate-300">{item}</span>
                        <span className="text-[#E06C75]">&lt;/li&gt;</span>
                      </div>
                    ))}
                  </div>
                )}
                <span className="text-[#E06C75]">&lt;/ul&gt;</span>
              </div>

              {/* a node */}
              <div 
                className={`pl-8 py-1 rounded transition-colors cursor-pointer flex items-center gap-2 ${
                  selectedNode === 'a' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/40'
                }`}
                onClick={() => setSelectedNode(selectedNode === 'a' ? null : 'a')}
              >
                <span className="text-[#E06C75]">&lt;a</span> <span className="text-[#D19A66]">href</span>=<span className="text-[#98C379]">"https://prozeducacao.com.br"</span><span className="text-[#E06C75]">&gt;</span>
                <span className="text-slate-100 max-w-[200px] truncate">{domState.linkText || ""}</span>
                <span className="text-[#E06C75]">&lt;/a&gt;</span>
                {currentStepInfo.htmlTargetIds.includes('a') && (
                  <span className="ml-auto text-[10px] bg-indigo-500 text-white px-1.5 py-0.2 rounded font-sans scale-90">Modificado</span>
                )}
              </div>

              {/* ol node */}
              <div 
                className={`pl-8 py-1 rounded transition-colors cursor-pointer ${
                  selectedNode === 'ol' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/40'
                }`}
                onClick={() => setSelectedNode(selectedNode === 'ol' ? null : 'ol')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#E06C75]">&lt;ol</span> <span className="text-[#D19A66]">id</span>=<span className="text-[#98C379]">"lista-ordenada"</span><span className="text-[#E06C75]">&gt;</span>
                  {currentStepInfo.htmlTargetIds.includes('lista-ordenada') && (
                    <span className="ml-auto text-[10px] bg-purple-500 text-white px-1.5 py-0.2 rounded font-sans scale-90">Injetado</span>
                  )}
                </div>
                {domState.orderedItems.length > 0 && (
                  <div className="pl-4 border-l border-slate-700 my-1 space-y-0.5">
                    {domState.orderedItems.map((item, idx) => (
                      <div key={idx} className="flex flex-wrap items-center gap-1">
                        <span className="text-[#E06C75]">&lt;li&gt;</span>
                        <span className="text-[#E06C75]">&lt;a</span> <span className="text-[#D19A66]">href</span>=<span className="text-[#98C379]">"{item.url}"</span><span className="text-[#E06C75]">&gt;</span>
                        <span className="text-slate-100">{item.label}</span>
                        <span className="text-[#E06C75]">&lt;/a&gt;</span>
                        <span className="text-[#E06C75]">&lt;/li&gt;</span>
                      </div>
                    ))}
                  </div>
                )}
                <span className="text-[#E06C75]">&lt;/ol&gt;</span>
              </div>

              <div className="pl-4">
                <span className="text-[#E06C75]">&lt;/body&gt;</span>
              </div>

              <div className="pl-0">
                <span className="text-[#E06C75]">&lt;/html&gt;</span>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* Footer Info */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Construído para fins didáticos • Demonstração de Conexão HTML com JavaScript
          </p>
          <div className="flex gap-4">
            <a 
              href="https://prozeducacao.com.br" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-sky-600 font-medium transition-colors inline-flex items-center gap-1"
            >
              Proz Educação <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
