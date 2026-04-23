#!/bin/bash

echo "📁 Criando estrutura de diretórios para 00-crudZero..."

# Diretório raiz
if [ ! -d "00-crudZero" ]; then
    mkdir -p 00-crudZero
    echo "✅ Criado: 00-crudZero/"
else
    echo "⏭️  Já existe: 00-crudZero/"
fi

# Backend
if [ ! -d "00-crudZero/backend" ]; then
    mkdir -p 00-crudZero/backend
    echo "✅ Criado: 00-crudZero/backend/"
else
    echo "⏭️  Já existe: 00-crudZero/backend/"
fi

# Frontend e suas subpastas
if [ ! -d "00-crudZero/frontend" ]; then
    mkdir -p 00-crudZero/frontend
    echo "✅ Criado: 00-crudZero/frontend/"
else
    echo "⏭️  Já existe: 00-crudZero/frontend/"
fi

if [ ! -d "00-crudZero/frontend/src" ]; then
    mkdir -p 00-crudZero/frontend/src
    echo "✅ Criado: 00-crudZero/frontend/src/"
else
    echo "⏭️  Já existe: 00-crudZero/frontend/src/"
fi

# App Router estrutura
if [ ! -d "00-crudZero/frontend/src/app" ]; then
    mkdir -p 00-crudZero/frontend/src/app
    echo "✅ Criado: 00-crudZero/frontend/src/app/"
else
    echo "⏭️  Já existe: 00-crudZero/frontend/src/app/"
fi

# Pasta cargo (CRUD)
if [ ! -d "00-crudZero/frontend/src/app/cargo" ]; then
    mkdir -p 00-crudZero/frontend/src/app/cargo
    echo "✅ Criado: 00-crudZero/frontend/src/app/cargo/"
else
    echo "⏭️  Já existe: 00-crudZero/frontend/src/app/cargo/"
fi

# Components
if [ ! -d "00-crudZero/frontend/src/components" ]; then
    mkdir -p 00-crudZero/frontend/src/components
    echo "✅ Criado: 00-crudZero/frontend/src/components/"
else
    echo "⏭️  Já existe: 00-crudZero/frontend/src/components/"
fi

# Services
if [ ! -d "00-crudZero/frontend/src/services" ]; then
    mkdir -p 00-crudZero/frontend/src/services
    echo "✅ Criado: 00-crudZero/frontend/src/services/"
else
    echo "⏭️  Já existe: 00-crudZero/frontend/src/services/"
fi

# Imagens (para o backend servir)
if [ ! -d "00-crudZero/imagens" ]; then
    mkdir -p 00-crudZero/imagens
    echo "✅ Criado: 00-crudZero/imagens/"
else
    echo "⏭️  Já existe: 00-crudZero/imagens/"
fi

# Criar arquivos básicos vazios (opcional)
echo ""
echo "📄 Criando arquivos básicos..."

# Frontend - layout.js
if [ ! -f "00-crudZero/frontend/src/app/layout.js" ]; then
    cat > 00-crudZero/frontend/src/app/layout.js << 'EOF'
export const metadata = {
  title: 'CRUD Zero',
  description: 'CRUD com Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
EOF
    echo "✅ Criado: frontend/src/app/layout.js"
fi

# Frontend - page.js (home)
if [ ! -f "00-crudZero/frontend/src/app/page.js" ]; then
    cat > 00-crudZero/frontend/src/app/page.js << 'EOF'
export default function Home() {
  return (
    <div>
      <h1>CRUD Zero - Home</h1>
      <p>Bem-vindo ao projeto!</p>
    </div>
  )
}
EOF
    echo "✅ Criado: frontend/src/app/page.js"
fi

# Frontend - cargo/page.js
if [ ! -f "00-crudZero/frontend/src/app/cargo/page.js" ]; then
    cat > 00-crudZero/frontend/src/app/cargo/page.js << 'EOF'
export default function CargoPage() {
  return (
    <div>
      <h1>CRUD de Cargo</h1>
      <p>Página para gerenciar cargos</p>
    </div>
  )
}
EOF
    echo "✅ Criado: frontend/src/app/cargo/page.js"
fi

echo ""
echo "🎉 Estrutura criada com sucesso em 00-crudZero/"