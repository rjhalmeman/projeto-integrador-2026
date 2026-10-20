# O Caso Therac-25: Aceleradores Lineares e o Erro de Software Mais Letal da História

## 1. Contexto Histórico da Radioterapia e Funcionamento dos Aceleradores Lineares
* **Descoberta dos Raios X e Radioatividade**: No final do século XIX, Wilhelm Röntgen descobriu os raios X, e posteriormente os físicos Pierre e Marie Curie aprofundaram os estudos sobre elementos radioativos como o rádio[cite: 1]. 
* **Surgimento da Medicina Radioncológica**: Percebeu-se que a radiação destruía tecidos vivos, mas também encolhia tumores[cite: 1]. Em novembro de 1899, os médicos Story Stenbeck e Tog Huegren realizaram o primeiro tratamento bem-sucedido de câncer de nariz via radiação[cite: 1].
* **Aceleradores Lineares (Década de 1950)**: Dispositivos projetados para acelerar elétrons a velocidades próximas à da luz[cite: 1].
* **Modos de Operação**:
  * **Modo de Elétrons**: O feixe de elétrons atinge diretamente a pele do paciente, sendo ideal para **tumores superficiais**[cite: 1].
  * **Modo de Fótons (Raios X)**: Os elétrons colidem com um alvo metálico (como tungstênio), gerando raios X de alta energia capazes de atingir **tumores profundos**[cite: 1].

---

## 2. A Linha Therac: A Transição da Segurança por Hardware para Software
* **Entrada da AECL no Mercado Médico**: Na década de 1970, a **Atomic Energy of Canada Limited (AECL)**, estatal canadense de energia nuclear, começou a fabricar aceleradores lineares medicinais[cite: 1].
* **Therac-6 e Therac-20**:
  * O **Therac-6** operava apenas em modo de elétrons e contava com rigorosas travas mecânicas e sensores físicos independentes de **segurança baseada em hardware**[cite: 1].
  * O **Therac-20** introduziu o modo duplo (elétrons e fótons) mantendo as barreiras físicas de proteção[cite: 1].
* **Therac-25 (1983)**:
  * Lançado com a proposta revolucionária de **segurança baseada exclusivamente em software**[cite: 1].
  * As travas mecânicas e sensores físicos foram removidos, delegando a responsabilidade total de checagem de segurança ao minicomputador **PDP-11**[cite: 1].
  * O equipamento realizou mais de 20.000 tratamentos iniciais sem falhas registradas, criando uma falsa sensação de confiabilidade absoluta[cite: 1].

---

## 3. Cronologia dos Acidentes e Sobredosagens de Radiação

| Data | Vítima / Local | Dose Recebida vs. Prescrita | Consequências |
| :--- | :--- | :--- | :--- |
| **03/06/1985** | **Catherine Bryan** (61 anos) <br> Geórgia, EUA | **20.000 rads** <br> *(Prescrito: 200 rads)* | Necrose severa no peito e costas; a fabricante (AECL) negou falha no equipamento[cite: 1]. A paciente faleceu devido às complicações[cite: 1]. |
| **26/07/1985** | **Frances Hill** (40 anos) <br> Ontário, Canadá | **~17.000 rads** | Apresentou o erro **Malfunction 54**[cite: 1]. O operador pressionou a tecla "P" 4 vezes[cite: 1]. Destruição total do quadril e óbito posterior[cite: 1]. |
| **03/12/1985** | **Paciente não identificada** <br> Washington, EUA | **~14.000 rads** | Acometida por necrose e paralisia[cite: 1]. Faleceu 2 meses após o incidente[cite: 1]. A AECL afirmou que overdoses eram impossíveis[cite: 1]. |
| **21/03/1986** | **Vonnie Ray Cox** (33 anos) <br> Tyler, Texas, EUA | **~25.000 rads** | Correção rápida de digitação (< 8s) provocou o erro **Malfunction 54**[cite: 1]. Sofreu paralisia severa e faleceu 5 meses depois[cite: 1]. |
| **11/04/1986** | **Verdon Kidd** (66 anos) <br> Tyler, Texas, EUA | **Overdose massiva** | Repetição da digitação rápida[cite: 1]. Destruição do lobo temporal e tronco encefálico[cite: 1]. Faleceu em 3 semanas[cite: 1]. |
| **17/01/1987** | **Glen Dodd** (65 anos) <br> Washington, EUA | **8.000 a 10.000 rads** | Equipamento reformulado apresentou erro de **Flatness** por estouro de variável[cite: 1]. Faleceu em abril de 1987[cite: 1]. |

---

## 4. Análise Técnica dos Erros de Software

### A. Condição de Corrida (Race Condition) – *Malfunction 54*
* **Ajuste de Modo e Tempo de Espera**: O mecanismo físico para alternar o disco giratório entre o modo de elétrons e o modo de fótons levava exatamente **8 segundos**[cite: 1].
* **Comunicação por Variáveis Globais**: As rotinas do sistema operacional no PDP-11 comunicavam-se através de variáveis globais armazenadas na RAM (como a variável `MOS` – *Mod Energy Offset*)[cite: 1].
* **Falha na Lógica de Leitura**: Durante os 8 segundos de rotação do disco, a rotina de controle do disco ficava inativa para novas leituras de variáveis[cite: 1].
* **A Origem do Erro**:
  1. Se o operador selecionasse o modo X (raios X) por engano e corrigisse para E (elétrons) usando a tecla de seta para cima e pressionando *Enter* **em menos de 8 segundos**[cite: 1]...
  2. A rotina do teclado atualizava a variável na RAM, mas a rotina do disco não lia a mudança[cite: 1].
  3. A interface do operador indicava modo de elétrons (baixa potência sem alvo), enquanto a máquina permanecia fisicamente configurada para o feixe de radiação máxima do modo de fótons[cite: 1].
  4. O acelerador disparava a potência máxima diretamente contra o paciente[cite: 1].
* **Uso Incorreto da Tecla "P"**: A mensagem *Malfunction 54* vinha acompanhada do aviso *"No Dose"*[cite: 1]. Seguindo orientação do manual, os operadores pressionavam a tecla "P" (*Proceed*) para continuar, aplicando novas doses maciças e letais seguidamente[cite: 1].

### B. Estouro de Inteiro (Integer Overflow) – *Erro de Flatness*
* **Monitoramento de Uniformidade**: O sistema utilizava um contador para monitorar falhas de uniformidade do feixe de radiação (*flatness*)[cite: 1].
* **Limitação de Memória**: O desenvolvedor utilizou uma variável de **8 bits** para esse contador[cite: 1]. Variáveis de 8 bits só conseguem armazenar números inteiros de **0 a 255**[cite: 1].
* **O Ocorrência do Overflow**: Quando a máquina detectava a 256ª inconsistência de uniformidade, ocorria um **estouro de inteiro (integer overflow)**, fazendo o contador retornar automaticamente ao valor **0**[cite: 1].
* **Liberação Indevida**: Ao ler o valor zero, o programa interpretava erroneamente que não existiam falhas de uniformidade e liberava a descarga total de radiação sobre o paciente[cite: 1].

---

## 5. Investigação Regulatória e Resposta da AECL
* **Investigação Autônoma**: O físico **Fritz Hager**, do East Texas Cancer Center, trabalhou continuamente até conseguir reproduzir o erro *Malfunction 54*, identificando que o bug estava condicionado à velocidade de digitação dos operadores[cite: 1].
* **Ações Iniciais da AECL**: A fabricante minimizou os relatos e chegou a propor como solução paliativa a remoção física da tecla de seta para cima e a aplicação de fita isolante nos contatos[cite: 1].
* **Intervenção do FDA**:
  * Em **26 de maio de 1986**, a *Food and Drug Administration* (FDA) declarou o Therac-25 oficialmente defeituoso, proibindo sua operação em território estadunidense[cite: 1].
  * Exigiu-se a entrega de um **Plano de Ação Corretiva (CAP)**[cite: 1].
  * A AECL foi obrigada a reescrever o software com 23 alterações de código e reintroduzir pelo menos 6 dispositivos de segurança baseados em **hardware**[cite: 1].

---

## 6. Negligência Profissional e Lições para a Engenharia de Software

* **Programador Único**: As investigações revelaram que todo o código do Therac-25 foi escrito, testado e mantido por um **único desenvolvedor**, cuja identidade nunca foi revelada publicamente[cite: 1].
* **Ausência de Processos de Qualidade**: Não foram realizados testes independentes, auditorias de código ou verificações formais de qualidade (*Quality Assurance*)[cite: 1].
* **Ausência de Responsabilização**: Nenhum executivo ou engenheiro da AECL foi condenado criminalmente pelas mortes[cite: 1]. A empresa foi privatizada e renomeada como *Theratronics International*[cite: 1].
* **Lição Fundamental**: O caso Therac-25 tornou-se um estudo de caso global sobre a ética e a responsabilidade no desenvolvimento de sistemas críticos[cite: 1]. **Desenvolvedores não escrevem apenas linhas de código; escrevem consequências reais sobre a vida humana**[cite: 1].
