import React, { useState, useEffect } from "react";

const globalStyles = `
  @import url('https://fonts.cdnfonts.com/css/sf-pro-display');
  
  html, body {
    margin: 0;
    padding: 0;
    background-color: black;
    min-height: 100vh;
    width: 100%;
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  #root {
    background-color: black;
    min-height: 100vh;
    width: 100%;
  }

  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }

    table {
      display: block;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
`; // Note o ponto e vírgula aqui

const inputStyles = `
  .input-container {
    display: block;
    width: 100%;
  }

  .input-field {
    width: 100%;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #2c2c2e;
    background-color: #2c2c2e;
    color: white;
    font-size: 12px;
    min-height: 40px;
    box-sizing: border-box;
    appearance: none;
  }

  select.input-field {
    background-color: #2c2c2e;
    color: white;
    cursor: pointer;
    padding-right: 30px;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 12px top 50%;
    background-size: 12px auto;
  }

  select.input-field option {
    background-color: #1c1c1e;
    color: white;
  }

  @media (max-width: 768px) {
    .input-field {
      font-size: 16px;
      min-height: 44px;
      padding: 10px 15px;
    }
    
    select.input-field {
      padding-right: 35px;
      background-position: right 15px top 50%;
    }
  }
`; // Note o ponto e vírgula aqui

const styleSheet = document.createElement("style");
styleSheet.innerText = globalStyles + inputStyles;
document.head.appendChild(styleSheet);

const TOOLS_DATA = {
  Midjourney: {
    plans: [
      { name: "Básico", credits: 200, price: 10 },
      { name: "Standard", credits: 900, price: 30 },
      { name: "Pro", credits: 1800, price: 60 },
      { name: "Mega", credits: 3600, price: 120 },
    ],
    features: [{ name: "Geração de Imagem", creditsPerGen: 1 }],
    extraCredits: { amount: 60, price: 4 },
  },
  "Flux AI": {
    plans: [
      { name: "Plano Grátis", credits: 40, price: 0 },
      { name: "Plano Standard", credits: 5000, price: 9.99 },
      { name: "Plano Popular", credits: 13000, price: 19.99 },
      { name: "Plano Professional", credits: 21000, price: 29.99 },
    ],
    features: [
      { name: "Flux.1 schnell", creditsPerGen: 10 },
      { name: "Flux.1 dev", creditsPerGen: 30 },
      { name: "Flux.1.1 pro", creditsPerGen: 50 },
      { name: "Flux.1 pro", creditsPerGen: 60 },
      { name: "Flux.1.1 pro ultra", creditsPerGen: 75 },
      { name: "Flux dev lora", creditsPerGen: 30 },
      { name: "Recraft", creditsPerGen: 50 },
      { name: "AI Video Standard-5s", creditsPerGen: 100 },
      { name: "AI Video Pro-5s", creditsPerGen: 250 },
      { name: "AI Video Pro-10s", creditsPerGen: 500 },
    ],
    extraCredits: { amount: 4000, price: 9.99 },
  },
  "Leonardo AI": {
    plans: [
      { name: "Plano Grátis", credits: 150, price: 0 },
      { name: "Plano Apprentice", credits: 8500, price: 12 },
      { name: "Plano Artisan", credits: 25000, price: 30 },
      { name: "Plano Maestro", credits: 60000, price: 60 },
    ],
    features: [
      { name: "Default Image", creditsPerGen: 1 },
      { name: "Elements", creditsPerGen: 1 },
      { name: "Prompt Magic V2", creditsPerGen: 2 },
      { name: "Remove Background", creditsPerGen: 2 },
      { name: "Unzoom V1", creditsPerGen: 5 },
      { name: "Upscalers", creditsPerGen: 5 },
      { name: "Alchemy", creditsPerGen: 8 },
      { name: "Alchemy V2", creditsPerGen: 16 },
      { name: "Canvas", creditsPerGen: 1 },
    ],
  },
  "Magnific AI": {
    plans: [
      { name: "Básico", credits: 200, price: 0 },
      { name: "Magnific Pro", credits: 2500, price: 39 },
      { name: "Magnific Premium", credits: 6500, price: 99 },
      { name: "Magnific Enterprise", credits: 20000, price: 299 },
    ],
    features: [
      { name: "Relight", creditsPerGen: 10 },
      { name: "Style Transfer", creditsPerGen: 5 },
      { name: "Magnific Upscaler - Normal", creditsPerGen: 12.5 },
      { name: "Magnific Upscaler - Large", creditsPerGen: 25 },
    ],
    extraCredits: { amount: 60, price: 10 },
  },
  Runway: {
    plans: [
      { name: "Plano Grátis", credits: 125, price: 0 },
      { name: "Plano Standard", credits: 625, price: 15 },
      { name: "Plano Pro", credits: 2250, price: 35 },
      { name: "Plano Unlimited", credits: 999999, price: 95 },
    ],
    features: [
      { name: "Geração de 1 imagem", creditsPerGen: 5 },
      { name: "Geração de 1s Gen-1", creditsPerGen: 14 },
      { name: "Geração de 1s Gen-2", creditsPerGen: 5 },
      { name: "Geração de 1s Gen-3 Alpha", creditsPerGen: 10 },
      { name: "Geração de 1s Gen-3 Alpha Turbo", creditsPerGen: 5 },
      { name: "Geração de 50 caracteres de Texto para Voz", creditsPerGen: 1 },
      { name: "Geração de 3s de Voz para Voz", creditsPerGen: 1 },
      { name: "Treinamento de IA personalizado", creditsPerGen: 1000 },
    ],
    extraCredits: { amount: 1000, price: 10 },
  },
  Pika: {
    plans: [
      { name: "Plano Grátis", credits: 150, price: 0 },
      { name: "Plano Standard", credits: 700, price: 10 },
      { name: "Plano Unlimited", credits: 2000, price: 35 },
      { name: "Plano Pro", credits: 999999, price: 70 },
    ],
    features: [{ name: "Geração de 1 vídeo (3s)", creditsPerGen: 15 }],
    extraCredits: { amount: 100, price: 10 },
  },
  "Kling AI": {
    plans: [
      { name: "Plano Grátis", credits: 66, price: 0 },
      {
        name: "Plano Standard",
        credits: 660,
        price: 10,
        extraPrice: 1.52,
        extraAmount: 100,
      },
      {
        name: "Plano Pro",
        credits: 3000,
        price: 37,
        extraPrice: 1.23,
        extraAmount: 100,
      },
      {
        name: "Plano Premier",
        credits: 8000,
        price: 92,
        extraPrice: 1.15,
        extraAmount: 100,
      },
    ],
    features: [
      { name: "Kling 1.0 - vídeo 5s", creditsPerGen: 10 },
      { name: "Kling 1.0 - vídeo 10s", creditsPerGen: 20 },
      { name: "Kling 1.5 - vídeo 5s", creditsPerGen: 35 },
      { name: "Kling 1.5 - vídeo 10s", creditsPerGen: 70 },
    ],
  },
  Minimax: {
    plans: [
      { name: "Plano Grátis", credits: 100, price: 0 },
      { name: "Plano Standard", credits: 1000, price: 9.99 },
      { name: "Plano Unlimited", credits: 999999, price: 94.99 },
    ],
    features: [{ name: "Geração de 1 vídeo (5s)", creditsPerGen: 30 }],
    extraCredits: { amount: 500, price: 5 },
  },
  Luma: {
    plans: [
      { name: "Plano Grátis", credits: 30, price: 0 },
      { name: "Plano Lite", credits: 70, price: 9.99 },
      { name: "Plano Standard", credits: 150, price: 29.99 },
      { name: "Plano Plus", credits: 310, price: 64.99 },
      { name: "Plano Pro", credits: 480, price: 99.99 },
      { name: "Plano Premier", credits: 2430, price: 499.99 },
    ],
    features: [{ name: "Luma - vídeo 5s", creditsPerGen: 1 }]
  },
  "Eleven Labs": {
    plans: [
      { name: "Plano Grátis", credits: 10000, price: 0 },
      {
        name: "Plano Starter",
        credits: 30000,
        price: 5,
      },
      {
        name: "Plano Creator",
        credits: 100000,
        price: 22,
        extraPrice: 0.30,
        extraAmount: 1000,
      },
      {
        name: "Plano Pro",
        credits: 500000,
        price: 99,
        extraPrice: 0.24,
        extraAmount: 1000,
      },
      {
        name: "Plano Scale",
        credits: 2000000,
        price: 330,
        extraPrice: 0.18,
        extraAmount: 1000,
      },
      {
        name: "Plano Business",
        credits: 11000000,
        price: 1320,
        extraPrice: 0.12,
        extraAmount: 1000,
      },
    ],
    features: [{ name: "Geração de 1min de audio", creditsPerGen: 1000 }],
  },
  Suno: {
    plans: [
      { name: "Plano Grátis", credits: 50, price: 0 },
      { name: "Plano Pro", credits: 2500, price: 10 },
      { name: "Plano Premier", credits: 10000, price: 30 },
    ],
    features: [{ name: "Songs", creditsPerGen: 5 }],
    extraCredits: { amount: 2500, price: 10 },
  },
};

export default function TheCalculator() {
  // Estados
  const [selectedTool, setSelectedTool] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedFeature, setSelectedFeature] = useState("");
  const [generations, setGenerations] = useState("");
  const [exchangeRate, setExchangeRate] = useState("5,00");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [results, setResults] = useState({
    creditsNeeded: 0,
    additionalCredits: 0,
    costUSD: 0,
    costBRL: 0,
    recommendUpgrade: false,
  });

  // Hook para mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Efeito para atualizar planos e features quando a ferramenta muda
  useEffect(() => {
    if (selectedTool && TOOLS_DATA[selectedTool]) {
      setAvailablePlans(TOOLS_DATA[selectedTool].plans);
      setAvailableFeatures(TOOLS_DATA[selectedTool].features);
      setSelectedPlan("");
      setSelectedFeature("");
    }
  }, [selectedTool]);

  // Função para formatar números
  const formatNumber = (value) => {
    if (!value) return "0,00";
    return Number(value)
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Função para calcular resultados
  const calculateResults = () => {
    if (!selectedTool || !selectedPlan || !selectedFeature || !generations)
      return;

    const tool = TOOLS_DATA[selectedTool];
    const plan = tool.plans.find((p) => p.name === selectedPlan);
    const feature = tool.features.find((f) => f.name === selectedFeature);

    if (!plan || !feature) return;

    // Calcula créditos necessários
    const creditsNeeded = feature.creditsPerGen * Number(generations);
    const additionalCredits = Math.max(0, creditsNeeded - plan.credits);

    // Inicializa custo com o preço do plano
    let totalCostUSD = plan.price;
    let shouldUpgrade = false;
    let nextPlanName = "";

    // Função auxiliar para verificar se é plano que precisa de upgrade automático
    const needsAutoUpgrade = () => {
      return (
        (selectedTool === "Eleven Labs" && 
         (plan.name === "Plano Grátis" || plan.name === "Plano Starter")) ||
        (selectedTool === "Runway" && plan.name === "Plano Grátis")||
        (selectedTool === "Kling AI" && plan.name === "Plano Grátis")||
        (selectedTool === "Luma" && plan.name !== "Plano Premier") // Todos os planos do Luma exceto o último
      );
      );
    };

    // Lógica para planos com upgrade automático
    if (additionalCredits > 0 && needsAutoUpgrade()) {
      // Encontra o próximo plano
      const currentPlanIndex = tool.plans.findIndex(p => p.name === plan.name);
      const nextPlan = tool.plans[currentPlanIndex + 1];
      
      if (nextPlan) {
        totalCostUSD = nextPlan.price;
        shouldUpgrade = true;
        nextPlanName = nextPlan.name;
      }
    }
    // Lógica para planos ilimitados
    else if (plan.credits === 999999) {
      totalCostUSD = plan.price;
    }
    // Lógica de créditos extras
    else if (additionalCredits > 0) {
      // Caso especial: Kling AI e Elevenlabs
      if (selectedTool === "Kling AI" || (selectedTool === "Eleven Labs" && plan.extraPrice)) {
        const extraPurchases = Math.ceil(additionalCredits / plan.extraAmount);
        totalCostUSD += extraPurchases * plan.extraPrice;
      }
      // Caso normal: usa sistema de créditos extras
      else if (tool.extraCredits && selectedTool !== "Luma") { // Excluir Luma da lógica de créditos extras
        const extraPurchases = Math.ceil(
          additionalCredits / tool.extraCredits.amount
        );
        totalCostUSD += extraPurchases * tool.extraCredits.price;
      }
    }

    // Calcula custo em BRL
    const exchangeRateNum = Number(exchangeRate.replace(",", "."));
    const totalCostBRL = totalCostUSD * exchangeRateNum;

    // Verifica se deve recomendar upgrade
    const currentPlanIndex = tool.plans.indexOf(plan);
    const nextPlan = tool.plans[currentPlanIndex + 1];
    const recommendUpgrade =
      nextPlan && additionalCredits > 0 && totalCostUSD >= nextPlan.price;

    setResults({
      creditsNeeded,
      additionalCredits: shouldUpgrade ? 0 : additionalCredits, // Reset additionalCredits se houver upgrade
      costUSD: totalCostUSD,
      costBRL: totalCostBRL,
      recommendUpgrade,
    });

    // Se precisar fazer upgrade automático, atualiza o plano selecionado
    if (shouldUpgrade) {
      setSelectedPlan(nextPlanName);
    }
  };

  // Efeito para recalcular quando inputs mudam
  useEffect(() => {
    calculateResults();
  }, [selectedTool, selectedPlan, selectedFeature, generations, exchangeRate]);

  return (
    <div
      style={{
        padding: isMobile ? "10px" : "20px",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "black",
        minHeight: "100vh",
        color: "white",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: isMobile ? "20px" : "30px",
          transform: isMobile ? "none" : "translateX(-30%)",
          fontSize: isMobile ? "24px" : "32px",
        }}
      >
        THE CALCULATOR
      </h1>

      <img
        src="/the-future-academy-logo-calculator.png" // Atualize com o caminho correto do seu logo
        alt="Logo da Empresa"
        style={{
          marginTop: isMobile ? "-10px" : "0", // Adicionar esta linha
          height: isMobile ? "70px" : "80px", // Ajuste conforme necessário
          width: "auto",
          position: isMobile ? "static" : "absolute", // Posicionamento absoluto
          top: isMobile ? "auto" : "25px", // Ajuste conforme necessário
          right: isMobile ? "auto" : "20px", // Ajuste conforme necessário
          transform: isMobile ? "translateX(160%)" : "translateX(-440%)", // Centraliza verticalmente
          marginBottom: isMobile ? "10px" : "0",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "15px" : "20px",
        }}
      >
        {/* Formulário */}
        <div
          style={{
            padding: isMobile ? "15px" : "20px",
            backgroundColor: "#1c1c1e", // Cor escura estilo Apple
            borderRadius: isMobile ? "8px" : "12px",
            border: "1px solid #2c2c2e",
          }}
        >
          {/* Tool Select */}
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: isMobile ? "4px" : "5px",
                color: "#fff",
                fontSize: isMobile ? "14px" : "15px",
                fontWeight: "500",
              }}
            >
              Ferramenta
            </label>
            <select
              className="input-field"
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              style={{ backgroundColor: "#2c2c2e", color: "white" }}
            >
              <option
                value=""
                style={{ backgroundColor: "#1c1c1e", color: "white" }}
              >
                Selecione a ferramenta
              </option>
              {Object.keys(TOOLS_DATA).map((tool) => (
                <option
                  key={tool}
                  value={tool}
                  style={{ backgroundColor: "#1c1c1e", color: "white" }}
                >
                  {tool}
                </option>
              ))}
            </select>
          </div>

          {/* Plan Select */}
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: isMobile ? "4px" : "5px",
                color: "#fff",
                fontSize: isMobile ? "14px" : "15px",
                fontWeight: "500",
              }}
            >
              Plano
            </label>
            <select
              className="input-field"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              style={{ backgroundColor: "#2c2c2e", color: "white" }}
            >
              <option
                value=""
                style={{ backgroundColor: "#1c1c1e", color: "white" }}
              >
                Selecione o plano
              </option>
              {availablePlans.map((plan) => (
                <option
                  key={plan.name}
                  value={plan.name}
                  style={{ backgroundColor: "#1c1c1e", color: "white" }}
                >
                  {plan.name}
                </option>
              ))}
            </select>
          </div>

          {/* Feature Select */}
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: isMobile ? "4px" : "5px",
                color: "#fff",
                fontSize: isMobile ? "14px" : "15px",
                fontWeight: "500",
              }}
            >
              Funcionalidade
            </label>
            <select
              className="input-field"
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value)}
              style={{ backgroundColor: "#2c2c2e", color: "white" }}
            >
              <option
                value=""
                style={{ backgroundColor: "#1c1c1e", color: "white" }}
              >
                Selecione a funcionalidade
              </option>
              {availableFeatures.map((feature) => (
                <option
                  key={feature.name}
                  value={feature.name}
                  style={{ backgroundColor: "#1c1c1e", color: "white" }}
                >
                  {feature.name}
                </option>
              ))}
            </select>
          </div>

          {/* Generations Input */}
          <div className="input-container" style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: isMobile ? "4px" : "5px",
                color: "#fff",
                fontSize: isMobile ? "14px" : "15px",
                fontWeight: "500",
              }}
            >
              Quantidade de Gerações
            </label>
            <input
              className="input-field"
              type="number"
              inputMode="decimal"
              min="0"
              step="1"
              value={generations}
              onKeyDown={(e) => {
                // Impede a digitação do sinal negativo
                if (e.key === "-") {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                // Remove qualquer sinal negativo e converte para número
                const value = Math.max(
                  0,
                  Number(e.target.value.replace("-", ""))
                );
                setGenerations(value);
              }}
              style={{
                width: "100%",
                padding: isMobile ? "12px" : "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: isMobile ? "16px" : "14px", // Fonte maior para mobile
                height: isMobile ? "44px" : "40px", // Altura maior para touch
              }}
              placeholder="Digite a quantidade"
            />
          </div>

          {/* Exchange Rate Input */}
          <div className="input-container" style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: isMobile ? "4px" : "5px",
                color: "#fff",
                fontSize: isMobile ? "14px" : "15px",
                fontWeight: "500",
              }}
            >
              Taxa de Câmbio ($ para R$)
            </label>
            <input
              className="input-field"
              type="number"
              inputMode="decimal"
              min="0"
              value={exchangeRate.replace(",", ".")}
              onChange={(e) =>
                setExchangeRate(formatNumber(Number(e.target.value)))
              }
              step="0.01"
              style={{
                width: "100%",
                padding: isMobile ? "12px" : "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: isMobile ? "16px" : "14px", // Fonte maior para mobile
                height: isMobile ? "44px" : "40px", // Altura maior para touch
              }}
            />
          </div>
        </div>

        {/* Resultados */}
        <div
          style={{
            padding: "20px",
            backgroundColor: "#1c1c1e", // Cor escura estilo Apple
            borderRadius: "12px",
            border: "1px solid #2c2c2e",
          }}
        >
          <h2
            style={{
              marginBottom: isMobile ? "15px" : "20px",
              color: "white",
              fontSize: isMobile ? "14px" : "16px",
            }}
          >
            Resultados
          </h2>

          <div
            style={{
              padding: isMobile ? "12px" : "15px",
              backgroundColor: "white",
              borderRadius: isMobile ? "6px" : "4px",
              marginBottom: isMobile ? "12px" : "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                color: "black",
              }}
            >
              <span>Total de Créditos Necessários</span>
              <strong>{formatNumber(results.creditsNeeded)}</strong>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "black",
              }}
            >
              <span>Créditos Adicionais</span>
              <strong>{formatNumber(results.additionalCredits)}</strong>
            </div>
          </div>

          <div
            style={{
              padding: isMobile ? "12px" : "15px",
              backgroundColor: "white",
              borderRadius: isMobile ? "6px" : "4px",
              marginBottom: isMobile ? "12px" : "15px",
              border: "2px solid rgb(231, 54, 158)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                color: "black",
              }}
            >
              <span>Valor a Pagar em $</span>
              <strong>${formatNumber(results.costUSD)}</strong>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "black",
              }}
            >
              <span>Valor a Pagar em R$</span>
              <strong>R${formatNumber(results.costBRL)}</strong>
            </div>
          </div>

          {results.recommendUpgrade && (
            <div
              style={{
                padding: isMobile ? "12px" : "15px",
                backgroundColor: "white",
                borderRadius: isMobile ? "6px" : "4px",
                marginBottom: isMobile ? "12px" : "15px",
                color: "black",
              }}
            >
              <strong style={{ display: "block", marginBottom: "5px" }}>
                Recomendação:
              </strong>
              <p>
                Recomendamos fazer upgrade para o próximo plano, caso a
                quantidade de gerações se torne recorrente.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabelas de Informações */}
      {selectedTool && (
        <div
          style={{
            marginTop: isMobile ? "20px" : "40px",
            backgroundColor: "#1c1c1e",
            borderRadius: isMobile ? "8px" : "12px",
            padding: isMobile ? "15px" : "20px",
            border: "1px solid #2c2c2e",
            overflowX: isMobile ? "auto" : "visible",
          }}
        >
          <h2
            style={{
              marginBottom: isMobile ? "15px" : "20px",
              color: "white",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "500",
            }}
          >
            Tabela de Planos - {selectedTool}
          </h2>

          {/* Tabela de Planos */}
          <div
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              margin: isMobile ? "-15px" : "0",
              padding: isMobile ? "15px" : "0",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
                borderRadius: "4px",
                minWidth: isMobile ? "500px" : "auto", // Força scroll horizontal
                fontSize: isMobile ? "12px" : "13px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f8f8f8" }}>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      borderBottom: "2px solid #ddd",
                      color: "black",
                      fontSize: "13px",
                    }}
                  >
                    Plano
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      borderBottom: "2px solid #ddd",
                      color: "black",
                      fontSize: "13px",
                    }}
                  >
                    Créditos
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      borderBottom: "2px solid #ddd",
                      color: "black",
                      fontSize: "13px",
                    }}
                  >
                    Preço ($)
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      borderBottom: "2px solid #ddd",
                      color: "black",
                      fontSize: "13px",
                    }}
                  >
                    Preço (R$)
                  </th>
                </tr>
              </thead>
              <tbody>
                {TOOLS_DATA[selectedTool].plans.map((plan, index) => (
                  <tr
                    key={plan.name}
                    style={{
                      borderBottom: "1px solid #ddd",
                      backgroundColor:
                        selectedPlan === plan.name ? "#d0d0d0" : "white",
                    }}
                  >
                    <td
                      style={{
                        padding: "8px",
                        color: "black",
                        fontSize: "13px",
                      }}
                    >
                      {plan.name}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "right",
                        color: "black",
                        fontSize: "13px",
                      }}
                    >
                      {plan.credits === 999999
                        ? "Ilimitado"
                        : formatNumber(plan.credits)}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "right",
                        color: "black",
                        fontSize: "13px",
                      }}
                    >
                      ${formatNumber(plan.price)}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "right",
                        color: "black",
                        fontSize: "13px",
                      }}
                    >
                      R$
                      {formatNumber(
                        plan.price * Number(exchangeRate.replace(",", "."))
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tabela de Funcionalidades */}
          <h2
            style={{
              marginTop: isMobile ? "20px" : "30px",
              marginBottom: isMobile ? "15px" : "20px",
              color: "white",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "500",
            }}
          >
            Funcionalidades e Consumo
          </h2>
          <div
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              margin: isMobile ? "-15px" : "0",
              padding: isMobile ? "15px" : "0",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
                borderRadius: "4px",
                minWidth: isMobile ? "500px" : "auto", // Força scroll horizontal
                fontSize: isMobile ? "12px" : "13px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f8f8f8" }}>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      borderBottom: "2px solid #ddd",
                      color: "black",
                      fontSize: "13px",
                    }}
                  >
                    Funcionalidade
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      borderBottom: "2px solid #ddd",
                      color: "black",
                      fontSize: "13px",
                    }}
                  >
                    Créditos por Geração
                  </th>
                </tr>
              </thead>
              <tbody>
                {TOOLS_DATA[selectedTool].features.map((feature) => (
                  <tr
                    key={feature.name}
                    style={{
                      borderBottom: "1px solid #ddd",
                      backgroundColor:
                        selectedFeature === feature.name ? "#d0d0d0" : "white",
                    }}
                  >
                    <td
                      style={{
                        padding: "8px",
                        color: "black",
                        fontSize: "13px",
                      }}
                    >
                      {feature.name}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "right",
                        color: "black",
                        fontSize: "13px",
                      }}
                    >
                      {formatNumber(feature.creditsPerGen)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Informações de Créditos Extras */}
          {TOOLS_DATA[selectedTool].extraCredits && (
            <div style={{ marginTop: "30px" }}>
              <h2
                style={{
                  marginBottom: isMobile ? "15px" : "20px",
                  color: "white",
                  fontSize: isMobile ? "14px" : "16px",
                  fontWeight: "500",
                }}
              >
                Créditos Extras
              </h2>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "white",
                  borderRadius: "4px",
                }}
              >
                <p style={{ color: "black", fontSize: "13px" }}>
                  Pacote de{" "}
                  {formatNumber(TOOLS_DATA[selectedTool].extraCredits.amount)}{" "}
                  créditos por $
                  {formatNumber(TOOLS_DATA[selectedTool].extraCredits.price)}
                </p>
                {selectedTool === "Kling AI" && (
                  <p
                    style={{
                      marginTop: "8px",
                      color: "#666",
                      fontSize: "12px",
                    }}
                  >
                    *Os preços de créditos extras variam conforme o plano
                    selecionado
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
