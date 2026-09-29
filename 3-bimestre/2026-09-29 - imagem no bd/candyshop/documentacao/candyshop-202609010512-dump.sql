-- ============================================
-- 1. CRIAÇÃO DAS TABELAS (ORDEM CORRETA)
-- ============================================

-- Tabelas sem dependências (primeiro)
CREATE TABLE public.pessoa (
    cpf_pessoa character varying(20) NOT NULL,
    nome_pessoa character varying(60),
    data_nascimento_pessoa date,
    endereco_pessoa character varying(150),
    senha_pessoa character varying(50),
    email_pessoa character varying(75)
);

CREATE TABLE public.cargo (
    id_cargo integer NOT NULL,
    nome_cargo character varying(45)
);

CREATE TABLE public.unidade_medida (
    id_unidade_medida character varying(2) NOT NULL,
    nome_unidade_medida character varying(30)
);

CREATE TABLE public.forma_pagamento (
    id_forma_pagamento integer NOT NULL,
    nome_forma_pagamento character varying(100)
);

-- Tabelas com 1 dependência
CREATE TABLE public.cliente (
    pessoa_cpf_pessoa character varying(20) NOT NULL,
    renda_cliente double precision,
    data_cadastro_cliente date
);

CREATE TABLE public.funcionario (
    pessoa_cpf_pessoa character varying(20) NOT NULL,
    salario_funcionario double precision,
    cargo_id_cargo integer,
    porcentagem_comissao_funcionario double precision
);

CREATE TABLE public.produto (
    id_produto integer NOT NULL,
    nome_produto character varying(45),
    quantidade_estoque_produto integer,
    preco_unitario_produto double precision,
    id_unidade_medida character varying(2)
);

-- Tabelas com múltiplas dependências
CREATE TABLE public.pedido (
    id_pedido integer NOT NULL,
    data_pedido date,
    cliente_pessoa_cpf_pessoa character varying(20),
    funcionario_pessoa_cpf_pessoa character varying(20)
);

CREATE TABLE public.pagamento (
    pedido_id_pedido integer NOT NULL,
    data_pagamento timestamp without time zone,
    valor_total_pagamento double precision
);

CREATE TABLE public.pedido_has_produto (
    produto_id_produto integer NOT NULL,
    pedido_id_pedido integer NOT NULL,
    quantidade integer,
    preco_unitario double precision
);

CREATE TABLE public.pagamento_has_forma_pagamento (
    pagamento_id_pedido integer NOT NULL,
    forma_pagamento_id_forma_pagamento integer NOT NULL,
    valor_pago double precision
);

-- ============================================
-- 2. SEQUENCES
-- ============================================

CREATE SEQUENCE public.cargo_id_cargo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.forma_pagamento_id_forma_pagamento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.pedido_id_pedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.produto_id_produto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- ============================================
-- 3. ALTERS PARA DEFAULTS DAS SEQUENCES
-- ============================================

ALTER SEQUENCE public.cargo_id_cargo_seq OWNED BY public.cargo.id_cargo;
ALTER SEQUENCE public.forma_pagamento_id_forma_pagamento_seq OWNED BY public.forma_pagamento.id_forma_pagamento;
ALTER SEQUENCE public.pedido_id_pedido_seq OWNED BY public.pedido.id_pedido;
ALTER SEQUENCE public.produto_id_produto_seq OWNED BY public.produto.id_produto;

ALTER TABLE ONLY public.cargo ALTER COLUMN id_cargo SET DEFAULT nextval('public.cargo_id_cargo_seq'::regclass);
ALTER TABLE ONLY public.forma_pagamento ALTER COLUMN id_forma_pagamento SET DEFAULT nextval('public.forma_pagamento_id_forma_pagamento_seq'::regclass);
ALTER TABLE ONLY public.pedido ALTER COLUMN id_pedido SET DEFAULT nextval('public.pedido_id_pedido_seq'::regclass);
ALTER TABLE ONLY public.produto ALTER COLUMN id_produto SET DEFAULT nextval('public.produto_id_produto_seq'::regclass);

-- ============================================
-- 4. CONSTRAINTS (CHAVES PRIMÁRIAS E ESTRANGEIRAS)
-- ============================================

-- Chaves Primárias
ALTER TABLE ONLY public.pessoa ADD CONSTRAINT pessoa_pkey PRIMARY KEY (cpf_pessoa);
ALTER TABLE ONLY public.cargo ADD CONSTRAINT cargo_pkey PRIMARY KEY (id_cargo);
ALTER TABLE ONLY public.unidade_medida ADD CONSTRAINT unidade_medida_pkey PRIMARY KEY (id_unidade_medida);
ALTER TABLE ONLY public.forma_pagamento ADD CONSTRAINT forma_pagamento_pkey PRIMARY KEY (id_forma_pagamento);
ALTER TABLE ONLY public.cliente ADD CONSTRAINT cliente_pkey PRIMARY KEY (pessoa_cpf_pessoa);
ALTER TABLE ONLY public.funcionario ADD CONSTRAINT funcionario_pkey PRIMARY KEY (pessoa_cpf_pessoa);
ALTER TABLE ONLY public.produto ADD CONSTRAINT produto_pkey PRIMARY KEY (id_produto);
ALTER TABLE ONLY public.pedido ADD CONSTRAINT pedido_pkey PRIMARY KEY (id_pedido);
ALTER TABLE ONLY public.pagamento ADD CONSTRAINT pagamento_pkey PRIMARY KEY (pedido_id_pedido);
ALTER TABLE ONLY public.pedido_has_produto ADD CONSTRAINT pedido_has_produto_pkey PRIMARY KEY (produto_id_produto, pedido_id_pedido);
ALTER TABLE ONLY public.pagamento_has_forma_pagamento ADD CONSTRAINT pagamento_has_forma_pagamento_pkey PRIMARY KEY (pagamento_id_pedido, forma_pagamento_id_forma_pagamento);

-- Chaves Estrangeiras
ALTER TABLE ONLY public.cliente ADD CONSTRAINT fk_cliente_pessoa FOREIGN KEY (pessoa_cpf_pessoa) REFERENCES public.pessoa (cpf_pessoa);

ALTER TABLE ONLY public.funcionario ADD CONSTRAINT fk_funcionario_pessoa FOREIGN KEY (pessoa_cpf_pessoa) REFERENCES public.pessoa (cpf_pessoa);
ALTER TABLE ONLY public.funcionario ADD CONSTRAINT fk_funcionario_cargo FOREIGN KEY (cargo_id_cargo) REFERENCES public.cargo (id_cargo);

ALTER TABLE ONLY public.produto ADD CONSTRAINT fk_produto_unidade_medida FOREIGN KEY (id_unidade_medida) REFERENCES public.unidade_medida (id_unidade_medida);

ALTER TABLE ONLY public.pedido ADD CONSTRAINT fk_pedido_cliente FOREIGN KEY (cliente_pessoa_cpf_pessoa) REFERENCES public.cliente (pessoa_cpf_pessoa);
ALTER TABLE ONLY public.pedido ADD CONSTRAINT fk_pedido_funcionario FOREIGN KEY (funcionario_pessoa_cpf_pessoa) REFERENCES public.funcionario (pessoa_cpf_pessoa);

ALTER TABLE ONLY public.pagamento ADD CONSTRAINT fk_pagamento_pedido FOREIGN KEY (pedido_id_pedido) REFERENCES public.pedido (id_pedido);

ALTER TABLE ONLY public.pedido_has_produto ADD CONSTRAINT fk_pedido_has_produto_produto FOREIGN KEY (produto_id_produto) REFERENCES public.produto (id_produto);
ALTER TABLE ONLY public.pedido_has_produto ADD CONSTRAINT fk_pedido_has_produto_pedido FOREIGN KEY (pedido_id_pedido) REFERENCES public.pedido (id_pedido);

ALTER TABLE ONLY public.pagamento_has_forma_pagamento ADD CONSTRAINT fk_pagamento_has_forma_pagamento_pagamento FOREIGN KEY (pagamento_id_pedido) REFERENCES public.pagamento (pedido_id_pedido);
ALTER TABLE ONLY public.pagamento_has_forma_pagamento ADD CONSTRAINT fk_pagamento_has_forma_pagamento_forma_pagamento FOREIGN KEY (forma_pagamento_id_forma_pagamento) REFERENCES public.forma_pagamento (id_forma_pagamento);

-- ============================================
-- 5. INSERTS (ORDEM CORRETA DE DEPENDÊNCIA)
-- ============================================

-- 5.1 PESSOA
INSERT INTO public.pessoa VALUES ('10101010101', 'Juliana Dias ssss', '1989-10-25', 'lins, 352 ssss', '1111', 'juliana@email.comm');
INSERT INTO public.pessoa VALUES ('44444444444', 'Ana Lima', '1995-04-25', 'Alameda do medo, 4534 apto 13', '.123456', 'ana@email.com');
INSERT INTO public.pessoa VALUES ('55555555555', 'Lucas Mendes', '1988-05-30', 'Rua sexta_feira, 13 _ apto 666', '.123456', 'lucas@email.com');
INSERT INTO public.pessoa VALUES ('66666666666', 'Fernanda Costa', '1993-06-05', 'muito longe, 243', '.123456', 'fernanda@email.com');
INSERT INTO public.pessoa VALUES ('77777777777', 'Ricardo Alves', '1987-07-10', 'far far faraway, 34', '.123456', 'ricardo@email.com');
INSERT INTO public.pessoa VALUES ('88888888888', 'Patrícia Gomes', '1994-08-15', 'acolá, 54', '.123456', 'patricia@email.com');
INSERT INTO public.pessoa VALUES ('99999999999', 'Marcos Rocha', '1991-09-20', 'kaxa prego _ ilha de itaparica', '.123456', 'marcos@email.com');
INSERT INTO public.pessoa VALUES ('22222222222', 'Maria Souza', '1985-02-15', 'lá longe, 1234', '.123456', 'maria@email.com');
INSERT INTO public.pessoa VALUES ('1', 'Berola', '2025-10-16', 'Lá onde Judas perdeu a unha, s/n', '12345', 'berola@gmail.com');
INSERT INTO public.pessoa VALUES ('00000000000', 'online', '1900-01-01', 'Loja', 'abc123', 'online@gmail.com');
INSERT INTO public.pessoa VALUES ('33333333333', 'Carlos Pereira', '1992-03-20', 'Rua que Judas perdeu as botas, 234', '123456x', 'carlos@email.com');
INSERT INTO public.pessoa VALUES ('11111111111', 'João Silva', '2025-01-01', 'algum lugar', '123456x', 'joao@email.com');
INSERT INTO public.pessoa VALUES ('2', 'dois', '2025-10-07', 'Rua das Magnólias', '123456x', 'dois@email.com');

-- 5.2 CARGO
INSERT INTO public.cargo VALUES (3, 'Caixa');
INSERT INTO public.cargo VALUES (4, 'Supervisor');
INSERT INTO public.cargo VALUES (5, 'Atendente');
INSERT INTO public.cargo VALUES (6, 'Repositor');
INSERT INTO public.cargo VALUES (7, 'Conferente');
INSERT INTO public.cargo VALUES (8, 'Assistente');
INSERT INTO public.cargo VALUES (9, 'Auxiliar');
INSERT INTO public.cargo VALUES (10, 'Diretor');
INSERT INTO public.cargo VALUES (0, 'Vendedor online');
INSERT INTO public.cargo VALUES (1, 'Vendedor');
INSERT INTO public.cargo VALUES (111, 'cento e onze dddd');
INSERT INTO public.cargo VALUES (2, 'Gerente');

-- 5.3 UNIDADE_MEDIDA
INSERT INTO public.unidade_medida VALUES ('UN', 'Unidade');
INSERT INTO public.unidade_medida VALUES ('KG', 'Quilograma');
INSERT INTO public.unidade_medida VALUES ('G', 'Grama');
INSERT INTO public.unidade_medida VALUES ('L', 'Litro');
INSERT INTO public.unidade_medida VALUES ('ML', 'Mililitro');
INSERT INTO public.unidade_medida VALUES ('CX', 'Caixa');
INSERT INTO public.unidade_medida VALUES ('PC', 'Pacote');

-- 5.4 FORMA_PAGAMENTO
INSERT INTO public.forma_pagamento VALUES (1, 'Dinheiro');
INSERT INTO public.forma_pagamento VALUES (2, 'Cartão de Crédito');
INSERT INTO public.forma_pagamento VALUES (3, 'Cartão de Débito');
INSERT INTO public.forma_pagamento VALUES (4, 'Pix');
INSERT INTO public.forma_pagamento VALUES (5, 'Boleto');
INSERT INTO public.forma_pagamento VALUES (6, 'Vale Alimentação');
INSERT INTO public.forma_pagamento VALUES (7, 'Transferência Bancária');
INSERT INTO public.forma_pagamento VALUES (8, 'Cheque');
INSERT INTO public.forma_pagamento VALUES (9, 'Crédito Loja');
INSERT INTO public.forma_pagamento VALUES (10, 'Gift Card');

-- 5.5 CLIENTE
INSERT INTO public.cliente VALUES ('22222222222', 3200, '2024-01-02');
INSERT INTO public.cliente VALUES ('33333333333', 1800, '2024-01-03');
INSERT INTO public.cliente VALUES ('44444444444', 4000, '2024-01-04');
INSERT INTO public.cliente VALUES ('55555555555', 2100, '2024-01-05');
INSERT INTO public.cliente VALUES ('66666666666', 3500, '2024-01-06');
INSERT INTO public.cliente VALUES ('77777777777', 2700, '2024-01-07');
INSERT INTO public.cliente VALUES ('88888888888', 5000, '2024-01-08');
INSERT INTO public.cliente VALUES ('99999999999', 3800, '2024-01-09');
INSERT INTO public.cliente VALUES ('11111111111', 2500, NULL);
INSERT INTO public.cliente VALUES ('10101010101', 4500, '2024-01-10');
INSERT INTO public.cliente VALUES ('1', 1111, '2025-10-11');
INSERT INTO public.cliente VALUES ('2', 22222, '2025-10-15');

-- 5.6 FUNCIONARIO
INSERT INTO public.funcionario VALUES ('22222222222', 3000, 2, 10);
INSERT INTO public.funcionario VALUES ('33333333333', 1500, 3, 3);
INSERT INTO public.funcionario VALUES ('44444444444', 2500, 4, 6);
INSERT INTO public.funcionario VALUES ('55555555555', 1800, 5, 4);
INSERT INTO public.funcionario VALUES ('66666666666', 1600, 6, 2);
INSERT INTO public.funcionario VALUES ('77777777777', 2200, 7, 5);
INSERT INTO public.funcionario VALUES ('88888888888', 1900, 8, 3);
INSERT INTO public.funcionario VALUES ('99999999999', 2800, 9, 7);
INSERT INTO public.funcionario VALUES ('10101010101', 5000, 2, 15);
INSERT INTO public.funcionario VALUES ('00000000000', 0, 0, 0);
INSERT INTO public.funcionario VALUES ('1', 1111, 2, 1);

-- 5.7 PRODUTO
INSERT INTO public.produto VALUES (8, 'Pão de Mel', 40, 60, 'UN');
INSERT INTO public.produto VALUES (9, 'Doce de Leite', 30, 85, 'UN');
INSERT INTO public.produto VALUES (4, 'Biscoito', 80, 32, 'PC');
INSERT INTO public.produto VALUES (1, 'Chocolate', 100, 55, 'UN');
INSERT INTO public.produto VALUES (3, 'Pirulito', 150, 10, 'UN');
INSERT INTO public.produto VALUES (5, 'Refrigerante', 50, 70, 'L');
INSERT INTO public.produto VALUES (7, 'Chiclete', 300, 75, 'PC');
INSERT INTO public.produto VALUES (10, 'Sorvete', 20, 12, 'UN');
INSERT INTO public.produto VALUES (2, 'Bala', 200, 43, 'PC');
INSERT INTO public.produto VALUES (6, 'Suco', 60, 45, 'L');
INSERT INTO public.produto VALUES (50, 'cinquenta', 50, 50, 'UN');

-- 5.8 PEDIDO
INSERT INTO public.pedido VALUES (3, '2024-02-03', '55555555555', '66666666666');
INSERT INTO public.pedido VALUES (7, '2024-02-07', '44444444444', '33333333333');
INSERT INTO public.pedido VALUES (8, '2024-02-08', '66666666666', '55555555555');
INSERT INTO public.pedido VALUES (9, '2024-02-09', '88888888888', '77777777777');
INSERT INTO public.pedido VALUES (10, '2024-02-10', '10101010101', '99999999999');
INSERT INTO public.pedido VALUES (20, '2025-10-10', '33333333333', '22222222222');
INSERT INTO public.pedido VALUES (4, '2024-02-04', '99999999999', '88888888888');
INSERT INTO public.pedido VALUES (5, '2024-02-05', '33333333333', '10101010101');
INSERT INTO public.pedido VALUES (1, '2024-02-01', '44444444444', '22222222222');
INSERT INTO public.pedido VALUES (2, '2024-02-02', '11111111111', '44444444444');
INSERT INTO public.pedido VALUES (11, '2025-11-12', '11111111111', '00000000000');
INSERT INTO public.pedido VALUES (12, '2025-11-12', '1', '00000000000');
INSERT INTO public.pedido VALUES (13, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (14, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (15, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (16, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (17, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (18, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (19, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (21, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (22, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (23, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (24, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (25, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (26, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (27, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (28, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (29, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (30, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (31, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (32, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (33, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (34, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (35, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (36, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (37, '2025-11-14', '1', '00000000000');
INSERT INTO public.pedido VALUES (38, '2025-11-14', '1', '00000000000');
INSERT INTO public.pedido VALUES (39, '2025-11-14', '1', '00000000000');
INSERT INTO public.pedido VALUES (40, '2025-11-14', '1', '00000000000');
INSERT INTO public.pedido VALUES (41, '2025-11-14', '1', '00000000000');
INSERT INTO public.pedido VALUES (42, '2025-11-15', '1', '00000000000');
INSERT INTO public.pedido VALUES (43, '2025-11-15', '1', '00000000000');
INSERT INTO public.pedido VALUES (44, '2025-11-15', '1', '00000000000');
INSERT INTO public.pedido VALUES (45, '2025-11-15', '1', '00000000000');
INSERT INTO public.pedido VALUES (46, '2025-11-15', '1', '00000000000');
INSERT INTO public.pedido VALUES (47, '2025-11-15', '1', '00000000000');
INSERT INTO public.pedido VALUES (48, '2025-11-16', '1', '00000000000');
INSERT INTO public.pedido VALUES (49, '2025-11-16', '1', '00000000000');
INSERT INTO public.pedido VALUES (50, '2025-11-16', '1', '00000000000');
INSERT INTO public.pedido VALUES (51, '2025-11-16', '1', '00000000000');
INSERT INTO public.pedido VALUES (52, '2025-11-16', '1', '00000000000');
INSERT INTO public.pedido VALUES (53, '2025-11-18', '1', '00000000000');
INSERT INTO public.pedido VALUES (54, '2025-11-18', '1', '00000000000');
INSERT INTO public.pedido VALUES (55, '2025-11-18', '1', '00000000000');
INSERT INTO public.pedido VALUES (56, '2025-11-20', '1', '00000000000');
INSERT INTO public.pedido VALUES (57, '2025-11-20', '1', '00000000000');
INSERT INTO public.pedido VALUES (58, '2025-11-20', '1', '00000000000');
INSERT INTO public.pedido VALUES (59, '2025-11-22', '1', '00000000000');
INSERT INTO public.pedido VALUES (60, '2025-11-23', '1', '00000000000');
INSERT INTO public.pedido VALUES (61, '2025-11-23', '1', '00000000000');
INSERT INTO public.pedido VALUES (62, '2025-12-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (63, '2025-12-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (64, '2025-12-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (65, '2025-12-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (66, '2025-12-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (67, '2025-12-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (68, '2025-12-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (69, '2025-12-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (70, '2025-12-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (71, '2025-12-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (72, '2025-12-13', '1', '00000000000');

-- 5.9 PAGAMENTO
INSERT INTO public.pagamento VALUES (1, '2024-02-01 10:00:00', 50);
INSERT INTO public.pagamento VALUES (2, '2024-02-02 11:00:00', 30);
INSERT INTO public.pagamento VALUES (3, '2024-02-03 12:00:00', 20);
INSERT INTO public.pagamento VALUES (4, '2024-02-04 13:00:00', 70);
INSERT INTO public.pagamento VALUES (5, '2024-02-05 14:00:00', 100);
INSERT INTO public.pagamento VALUES (7, '2024-02-07 16:00:00', 25);
INSERT INTO public.pagamento VALUES (8, '2024-02-08 17:00:00', 45);
INSERT INTO public.pagamento VALUES (9, '2024-02-09 18:00:00', 60);
INSERT INTO public.pagamento VALUES (10, '2024-02-10 19:00:00', 90);
INSERT INTO public.pagamento VALUES (64, '2025-12-13 08:07:02.875', 9.8);
INSERT INTO public.pagamento VALUES (65, '2025-12-13 08:58:10.097', 13);
INSERT INTO public.pagamento VALUES (66, '2025-12-13 09:00:47.612', 13);
INSERT INTO public.pagamento VALUES (71, '2025-12-13 09:12:45.255', 13.35);
INSERT INTO public.pagamento VALUES (72, '2025-12-13 09:15:50.149', 13.35);

-- 5.10 PEDIDO_HAS_PRODUTO
INSERT INTO public.pedido_has_produto VALUES (1, 1, 2, 5.5);
INSERT INTO public.pedido_has_produto VALUES (2, 2, 10, 0.5);
INSERT INTO public.pedido_has_produto VALUES (3, 2, 5, 1);
INSERT INTO public.pedido_has_produto VALUES (4, 2, 3, 3.2);
INSERT INTO public.pedido_has_produto VALUES (5, 5, 2, 7);
INSERT INTO public.pedido_has_produto VALUES (3, 1, 3, 1);
INSERT INTO public.pedido_has_produto VALUES (2, 3, 1, 0.5);
INSERT INTO public.pedido_has_produto VALUES (4, 4, 4, 4);
INSERT INTO public.pedido_has_produto VALUES (2, 1, 1000, 0.7);
INSERT INTO public.pedido_has_produto VALUES (2, 20, 1, 0.5);
INSERT INTO public.pedido_has_produto VALUES (1, 36, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (3, 36, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (8, 37, 200, 60);
INSERT INTO public.pedido_has_produto VALUES (10, 37, 100, 12);
INSERT INTO public.pedido_has_produto VALUES (2, 38, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (7, 38, 100, 75);
INSERT INTO public.pedido_has_produto VALUES (6, 38, 100, 45);
INSERT INTO public.pedido_has_produto VALUES (4, 39, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (5, 39, 100, 70);
INSERT INTO public.pedido_has_produto VALUES (6, 39, 100, 45);
INSERT INTO public.pedido_has_produto VALUES (1, 40, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 40, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 40, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (4, 40, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (5, 40, 100, 70);
INSERT INTO public.pedido_has_produto VALUES (1, 41, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (3, 41, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (4, 41, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (10, 42, 100, 12);
INSERT INTO public.pedido_has_produto VALUES (2, 42, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 42, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (1, 43, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 43, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 43, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (2, 44, 1, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 44, 1, 10);
INSERT INTO public.pedido_has_produto VALUES (3, 45, 1, 10);
INSERT INTO public.pedido_has_produto VALUES (2, 45, 4, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 47, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (2, 47, 1000, 43);
INSERT INTO public.pedido_has_produto VALUES (1, 48, 300, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 48, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (2, 49, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 49, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (4, 49, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (2, 50, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 50, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (4, 50, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (2, 51, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 51, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (4, 51, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (2, 52, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 52, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (4, 52, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (1, 53, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 53, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (1, 54, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 54, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (1, 55, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 55, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (4, 56, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (3, 56, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (2, 57, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 57, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (2, 58, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 58, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (1, 59, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (3, 59, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (5, 60, 100, 70);
INSERT INTO public.pedido_has_produto VALUES (5, 61, 100, 70);
INSERT INTO public.pedido_has_produto VALUES (1, 62, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 62, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (1, 63, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 63, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (1, 64, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 64, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (1, 65, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 65, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (4, 65, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (1, 66, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 66, 100, 43);

-- 5.11 PAGAMENTO_HAS_FORMA_PAGAMENTO
INSERT INTO public.pagamento_has_forma_pagamento VALUES (1, 1, 20);