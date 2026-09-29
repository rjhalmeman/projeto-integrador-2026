Exercício da versão 3 - v003
Faça o CRUD para forma de pagamento.

-------

Faça uma cópia da versão anterior

Execute para garantir que está funcionando

Verificar se sua cópia do sistema modelo (candyshop) está funcionando. Não adicionar nada antes de fazer o básico funcionar.


Para continuar o desenvolvimento do sistema

PLANEJAMENTO é a chave para não gastar tempo e energia fazendo coisas inúteis.


1) olhar para o DER e procurar tabelas "parecidas" com o que já foi feito. Isso é importante para copiar o código e modificar menos coisas.
2) temos 2 possilidades parecidas com unidade_medida. São forma_pagamento e cargo. Essas tabelas não dependem de outra e não possuem relações de 1:1.
3) Vou escolher primeiro cargo. (poderia ser forma_pagamento). 
4) O que vou precisar fazer?
   1) na pasta frontend, 
      1) criar uma pasta chamada cargo
      2) dentro da pasta cargo, terei 3 arquivos. cargo.css, cargo.html e cargo.js. Os conteúdos desses arquivos podem ser copiados da tabela parecida que já está pronta. Neste caso, unidade_medida.
      3) na pasta menu, abrir o menu.html. Na classe menu-grid, acrescentar a chamada para o novo crud.
   2) na pasta backend
      1)  vou precisar acrescentar a rota cargo no server.js
      2)  dentro da pasta routes, criar cargoRoutes.js
      3)  dentro da pasta controllers, criar cargoController.js
5) Derrubar e subir o server.js. 
6) Iniciar o sistema pelo index.html (via live server)
7) Testar se funcionou e corrigir problemas que surgirem.