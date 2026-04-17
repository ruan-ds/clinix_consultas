import React from 'react';
import './register.css';
import logo from '../../assets/images/logoNome.png';
import { useState } from "react";
import { createAccount } from "../../services/auth";

// Typescript pede que defina os tipos que podem ser passados em cada parâmetro da props, isso ocorre na linha abaixo
type Props = {
  changeAuth: (valor: number) => void;//defino que o parâmetro changeAuth deve receber somente numeros, é void pois nao retorna nada
};

// Abaixo é a função principal do componente e nos parenteses o props passado a ela
function Register({ changeAuth }: Props) {
  //tirar os espaços na hora de manda pro banco 
  const limparTexto = (str: string) => str.trim().replace(/\s+/g, ' ');

  //armazena dados
  //obs:fazer um para atualizar inputs
  const [estado, setEstado] = useState(0)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [sexo, setSexo] = useState("");

  //requisicao do endereco
  const [estados, setEstados] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cep, setCep] = useState("");

  //requisicao do telefone 
  const [telefone, setTelefone] = useState("");

  function renderEstados() {
    const estados: { nome: string; sigla: string }[] = [
      { nome: "Acre", sigla: "AC" },
      { nome: "Alagoas", sigla: "AL" },
      { nome: "Amapá", sigla: "AP" },
      { nome: "Amazonas", sigla: "AM" },
      { nome: "Bahia", sigla: "BA" },
      { nome: "Ceará", sigla: "CE" },
      { nome: "Distrito Federal", sigla: "DF" },
      { nome: "Espírito Santo", sigla: "ES" },
      { nome: "Goiás", sigla: "GO" },
      { nome: "Maranhão", sigla: "MA" },
      { nome: "Mato Grosso", sigla: "MT" },
      { nome: "Mato Grosso do Sul", sigla: "MS" },
      { nome: "Minas Gerais", sigla: "MG" },
      { nome: "Pará", sigla: "PA" },
      { nome: "Paraíba", sigla: "PB" },
      { nome: "Paraná", sigla: "PR" },
      { nome: "Pernambuco", sigla: "PE" },
      { nome: "Piauí", sigla: "PI" },
      { nome: "Rio de Janeiro", sigla: "RJ" },
      { nome: "Rio Grande do Norte", sigla: "RN" },
      { nome: "Rio Grande do Sul", sigla: "RS" },
      { nome: "Rondônia", sigla: "RO" },
      { nome: "Roraima", sigla: "RR" },
      { nome: "Santa Catarina", sigla: "SC" },
      { nome: "São Paulo", sigla: "SP" },
      { nome: "Sergipe", sigla: "SE" },
      { nome: "Tocantins", sigla: "TO" }
    ];

    return estados.map((e) => (
      <option key={e.sigla} value={e.sigla}>
        {e.nome}
      </option>
    ));
  }


  // a função sign_up armazena os datos no data, que são passados para fazer a requisição
  async function sign_up() {
    const nomeFormatado = limparTexto(nome) // Regrinha pro Nome ir pro banco de daods Somente com espaços necessários
    const cidadeFormatado = limparTexto(cidade)
    const bairroFormatado = limparTexto(bairro)
    const ruaFormatada = limparTexto(rua) 
    const complementoFormatado = limparTexto(complemento)


    const data = {
      person: {
        name: nomeFormatado,
        cpf: cpf,
        sex: sexo,
        birthday: nascimento
      },
      address: {
        state: estados,
        city: cidadeFormatado,
        neighborhood: bairroFormatado,
        street: ruaFormatada,  
        number: numero,
        complement: complementoFormatado,
        cep: cep
      },
      phone: {
        phone:telefone,
        type:"celular"
      },
      access: {
        email: email,
        password: password
      }
    };
    //a linha abaixo envia o data para fazer a requisição
    const response = await createAccount(data);
  }


  if (estado === 0) {
    return (
      <main className="register-container">

        <section className="register-card">

          <div className="logo-box">
            <img src={logo} alt="Clinix Consultas" className="logo" />
          </div>

          {/*  // o e.preventDefault abaixo serve para dizer que ao ocorrer o evento a página nao deve ser recarregada */}
          <form onSubmit={(e) => { e.preventDefault(); setEstado(1); }} >
            <div className="input-group">
              <input type="email" id="user" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} required /> {/* Aqui pega as informaçoes alteradas no input*/}
            </div>

            <div className="input-group">
              <input type="password" id="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="btn-register">Prosseguir</button>

          </form>

          <div className="signup-footer">
            <p>Você já possui uma conta? <a href="#" onClick={() => changeAuth(1)}>Entre aqui </a></p>
          </div>

        </section>

        <aside className="promo-card">
          <h2>Agende consultas<br />com 1 Clique</h2>
          <p>Acesse milhares de especialistas e<br />gerencie sua saúde</p>
        </aside>

      </main>
    );
  } else if (estado === 1) {
    return (
      <main className="register-container">
        <section className="register-card">
          <div className="logo-box">
            <img src={logo} alt="Clinix Consultas" className="logo" />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setEstado(2); }}>
            <div className="input-row">
              <div className="input-group">
                <input type="text" placeholder="Nome Completo" onChange={(e) => setNome(e.target.value)} required />
              </div>
              <div className="input-group">

                {/*Faz a verificação sé é valido o cpf usando a regrinha abaixo e mostra o valor da váriavel cpf para
                o usuário ver em tempo real oque está digitando*/}
                <input type="text" placeholder="CPF" maxLength={11} minLength={11} value={cpf} onChange={(e) => {
                  // A regra /\D/g significa "tudo que NÃO for número"
                  // O replace substitui o que não for número por "nada" (vazio)
                  const apenasNumeros = e.target.value.replace(/\D/g, '');
                  setCpf(apenasNumeros);
                }}
                  required
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <input type="text" placeholder="Telefone" maxLength={11} minLength={11} value={telefone} onChange={(e) => {
                  // A regra /\D/g significa "tudo que NÃO for número"
                  // O replace substitui o que não for número por "nada" (vazio)
                  const apenasNumeros = e.target.value.replace(/\D/g, '');
                  setTelefone(apenasNumeros);
                }}
                  required
                />
              </div>
              <div className="input-group">
                <input type="text" placeholder="CEP" maxLength={8} minLength={8} value={cep} onChange={(e) => {
                  // A regra /\D/g significa "tudo que NÃO for número"
                  // O replace substitui o que não for número por "nada" (vazio)
                  const apenasNumeros = e.target.value.replace(/\D/g, '');
                  setCep(apenasNumeros);
                }}
                  required
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <input type="text" placeholder="Data nascimento" onFocus={(e) => e.target.type = 'date'} onChange={(e) => setNascimento(e.target.value)} required />
              </div>
              <div className="input-group">
                <select
                  style={{ width: '100%', padding: '16px', borderRadius: '40px', border: '1px solid #E0E0E0', background: 'white' }}
                  onChange={(e) => setSexo(e.target.value)}
                  required
                >
                  <option value="">Sexo</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="L">Outro</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-register">Prosseguir</button>
          </form>

          <div className="signup-footer">
            <p>Já tem uma conta? <a href="#" onClick={() => changeAuth(1)}>Fazer Login</a></p>
          </div>
        </section>

        <aside className="promo-card">
          <h2>Saúde na palma<br />da mão</h2>
          <p>Histórico médico, agendamento rápidos e<br />receitas digitais. Tudo em um só lugar.</p>
        </aside>
      </main>
    );
  } else {
    return (
      <main className="register-container">
        <section className="register-card">
          <div className="logo-box">
            <img src={logo} alt="Clinix Consultas" className="logo" />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); sign_up(); }}>
            <div className="input-row">
              <div className="input-group">
                <select
                  style={{ width: '100%', padding: '16px', borderRadius: '40px', border: '1px solid #E0E0E0', background: 'white' }}
                  onChange={(e) => setEstados(e.target.value)}
                  required
                >
                  <option value="">Estado</option>
                  {renderEstados()}
                </select>
              </div>
              <div className="input-group">
                <input type="text" value={cidade} placeholder="Cidade" onChange={(e) => setCidade(e.target.value)} required />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <input type="text" value={bairro} placeholder="Bairro" onChange={ (e) => setBairro(e.target.value)} required />
              </div>
              <div className="input-group">
                <input type="text"  value={rua} placeholder="Rua" onChange={(e) => setRua(e.target.value)} required />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <input type="text" value={numero} placeholder="Número" onChange={(e) => setNumero(e.target.value)} required />
              </div>
              <div className="input-group">
                <input type="text" value={complemento} placeholder="Complemento" onChange={(e) => setComplemento(e.target.value)} required />
              </div>
            </div>

            <button type="submit" className="btn-register">Criar Conta</button>
          </form>

          <div className="signup-footer">
            <p>Já tem uma conta? <a href="#" onClick={() => changeAuth(1)}>Fazer Login</a></p>
          </div>
        </section>

        <aside className="promo-card">
          <h2>Saúde na palma<br />da mão</h2>
          <p>Histórico médico, agendamento rápidos e<br />receitas digitais. Tudo em um só lugar.</p>
        </aside>
      </main>
    )
  }
}

export default Register;