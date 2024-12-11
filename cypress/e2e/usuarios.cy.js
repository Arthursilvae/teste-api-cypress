/// <reference types="cypress" />
import contrato from '../Contratos/usuarios.contrato'

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários com sucesso', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    });
  });

  it('Deve listar usuários cadastrados -GET-', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).should((response) => {
      expect(response.status).equal(200);
      expect(response.body).to.have.property('usuarios');
    });
  });

  it('Deve cadastrar um usuário com sucesso -POST-', () => {
    let usuarios = 'usuario EBAC ' + Math.floor(Math.random() * 100000); // gerar um nome único e guarda na variável usuarios
    let nome = usuarios;
    let email = 'usuario_' + Math.floor(Math.random() * 10000) + '@qa.com'; // gerar um email único
    let password = 'teste';
    let administrador = 'true';

    cy.cadastrarUsuario(usuarios, email, password, administrador).should((response) =>{
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido -POST-', () => {
    cy.cadastrarUsuarioComEmailnvalido('usuario EBAC', 'fulano@qa.com', 'teste123', 'true').should((response) =>{
      expect(response.status).equal(400)
      expect(response.body.message).equal('Este email já está sendo usado')
    })
  });

  it('Deve editar um usuário previamente cadastrado -PUT-', () => {
    let usuario = 'Usuario EBAC editado' + Math.floor(Math.random() * 10000);
    let email = 'usuarioeditado_' + Math.floor(Math.random() * 10000) + '@qa.com';
    cy.cadastrarUsuario('usuario a ser editado', email, 'senha a ser editada', 'true').then(response => {
      let id = response.body._id;
      cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        body: {
          "nome": usuario,
          "email": email,
          "password": "senhaeditada",
          "administrador": "true"
        }
      }).should(response => {
        expect(response.body.message).to.equal('Registro alterado com sucesso')
        expect(response.status).to.equal(200)
      })
    })
  });

  it('Deve deletar um usuário previamente cadastrado -DELETE-', () => {
    cy.cadastrarUsuario('usuario a ser deletado', 'usuario@qa.com', 'teste', 'true').then(response =>{
      let id = response.body._id;
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`
      }).should(response => {
        expect(response.body.message).to.equal('Registro excluído com sucesso')
        expect(response.status).to.equal(200)
      })
    })
  });

});

