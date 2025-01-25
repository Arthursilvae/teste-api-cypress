pipeline {
    agent any //define que a pipeline pode rodar em qualquer agente disponível
    stages { //etapas da pipeline
        stage('Clonar o repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/Arthursilvae/teste-api-cypress' // etapa 1 "clonar o repositorio"
            }
        }
        stage('Instalar dependencias') {
            steps {
                sh 'npm install' // etapa 2 "instalar as dependencias"
            }
        }
        stage('Executar testes') {
            steps {
                sh 'NO_COLOR=1 npm run cy:run' // etapa 3 rodar o cypress e desativa as cores do terminal
            }
        }
    }
}
