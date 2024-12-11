/// <reference types= "cypress"/>
import contrato from '../Contratos/produtos.contrato'

describe('Teste de API em produtos', () => {

    let token
    beforeEach(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn =>{
            token = tkn
        })
    });
    it('Deve validar contrato de produtos com sucesso', () => {
        cy.request('produtos').then(response => {
            return contrato.validateAsync(response.body)
        })
    });

    it('Deve listar produtos com sucesso -GET-', () => {
        cy.request({
            method: 'GET',
            url:'produtos'
        }).should((response) => {
            expect(response.status).equal(200)
            expect(response.body).to.have.property('produtos')
        })
        
    });
    
    it('Deve cadastrar produto com sucesso -POST-', () => {
        let produto = 'produto EBAC ' + Math.floor(Math.random() * 10000000000)
        cy.cadastrarProduto(token, produto , 4700 ,'Smartphone', 800)
        .should((response) =>{
            expect(response.status).equal(201)
            expect(response.body.message).equal('Cadastro realizado com sucesso')
        })
        
    });

    it('Deve validar mensagem de produto cadastrado anteriomente -POST-', () => {
        cy.cadastrarProduto(token,'iphone 13', 4700,'Smartphone', 800)
        .should((response) =>{
            expect(response.status).equal(400)
            expect(response.body.message).equal('Já existe produto com esse nome')
        })  
    });
    it('Deve editar um produto com sucesso -PUT-', () => {
        let produto = 'produto EBAC editado ' + Math.floor(Math.random() * 10000000000)
        cy.cadastrarProduto(token, produto , 4700 ,'Produto editado', 800)
        .then(response =>{
            let id = response.body._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: {authorization: token}, // autorização usando o token
                body: {
                    "nome": produto,
                    "preco": 520,
                    "descricao": "Produto editado",
                    "quantidade": 200
                  }
            }).should(response =>{
                expect(response.body.message).to.equal('Registro alterado com sucesso')
                expect(response.status).to.equal(200)
            })
        })
        
    });
    it('Deve deletar um produto com sucesso -DELETE-', () => {
        cy.cadastrarProduto(token,'produto EBAC a ser deletado', 200, 'delete', 100)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url:`produtos/${id}`,
                headers: {authorization: token}
            }).should(response =>{
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })
        })
    });
});