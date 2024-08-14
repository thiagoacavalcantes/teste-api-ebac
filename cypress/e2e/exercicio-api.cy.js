/// <reference types="cypress" />
import contrato from'../contracts/usuarios.contract'
let token;

before(() => {
  cy.request({
    method: 'POST',
    url: 'login',
    body: {
      email: 'fulano@qa.com',
      password: 'teste'
    },
    failOnStatusCode: false 
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error(`Erro ao fazer login: ${response.status} - ${response.body}`);
    }
    expect(response.status).to.equal(200);
    token = response.body.token;
  });
});

describe('Testes da Funcionalidade Usuários', () => {

  it.only('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response =>{
      return contrato.validateAsync(response.body)
  })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
  }).should((response) => {
      expect(response.status).equal(200)
      expect(response.body).to.have.property('usuarios')
  }) 
  });

  it('Deve cadastrar um usuário com sucesso', () => {
     cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": "Exercicio EBAC3",
        "email": "exercicio6@qa.com.br",
        "password": "teste",
        "administrador": "true"
      }
     }).should(response => {
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      expect(response.status).to.equal(201)
  });
})

it('Deve validar um usuário com email já cadastrado', () => {
  cy.request({
    method: 'POST',
    url: 'usuarios',
    body: {
      "nome": "Exercicio EBAC",
      "email": "exercicio10@qa.com.br",
      "password": "teste",
      "administrador": "true"
    },
    failOnStatusCode: false 
  }).should(response => {
    expect(response.status).to.equal(400); 
    expect(response.body.message).to.equal('Este email já está sendo usado');
  });
});

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.request({
      method: 'PUT',
      url: 'usuarios/07BXSsXiuDR55xoV',
      body: {
        "nome": "Teste edição exercício EBAC",
        "email": "exercicio2@qa.com.br",
        "password": "teste",
        "administrador": "true"
      },
      headers: {
        authorization: token
      }
    }).should((response) => {
      expect(response.body.message).to.equal('Registro alterado com sucesso');
    });
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
     cy.request({
      method: 'DELETE',
      url: 'usuarios/yG58fxjLn7U7HNTG',
     }).should((response) => {
      expect(response.body.message).to.equal('Registro excluído com sucesso');
    });
  });


});

    