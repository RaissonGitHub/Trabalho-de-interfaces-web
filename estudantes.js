function buscarEstudantes() {
    var params = "";
    const nome = $('#pnome').val();
    $('td').remove('.c-t');
    $.ajax({
        type: "GET",
        url: `https://ingresso.ifrs.edu.br/prematricula/ws/listarAlunosIW20242.php?nome=${nome}`,
        data: params,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg, status) {
            console.log('Resposta da API:', msg);
            tbody = $('.c-tbody')
            tbody.empty()
            msg.forEach(element => {
                tbody.append(
                    `<tr>\
                    <td class="c-t"><input class="form-check-input" type="radio" name="selecao" id="${element.noInscricao}"></td>\
                    <td class="c-t">${element.noInscricao}</td>\
                    <td class="c-t">${element.nome}</td>\
                    <td class="c-t">${element.email}</td>\
                    <td class="c-t">${element.curso.nome}</td>\
                    </tr>`
                )
            });
            if (!$.fn.dataTable.isDataTable('#tabela-estudantes')) {
                $('#tabela-estudantes').DataTable({
                    searching: false
                });
            }

        },
        error: function (xhr, msg, e) {
            console.error('Erro na requisição:');
        }
    });
}

function consultarCEP() {
    $('div').remove('.cep')

    var params = "";
    
    let cep = $('#cep').val()
    
    $.ajax({
        type: "GET",
        url: `https://viacep.com.br/ws/${cep}/json/`,
        data: params,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg, status) {
            console.log('Resposta da API:', msg);
            $('#logradouro').val(msg.logradouro)
            $('#complemento').val(msg.complemento)
            $('#bairro').val(msg.bairro)
            $('#cidade').val(msg.localidade)
            $('#estado').val(msg.uf)
            

        },
        error: function (xhr, msg, e) {
            $('#cep').after('<div class="alert alert-danger cep" role="alert">CEP inválido</div>')
        }
    });
}

function formatarMatricula() {

    let matricula = $('#matricula')

    let m = matricula.val().replace(/\D/g, '')

    m = m.substring(0, 9)
    if (m.length > 2) {
        m = m.replace(/(\d{2})(\d)/, '$1.$2')
    }
    matricula.val(m);

}

function upper() {
    $("#nome").val($("#nome").val().toUpperCase())
}

function formatarCPF() {
    let cpf = $('#cpf');
    let c = cpf.val().replace(/\D/g, '')
    c = c.substring(0, 11)
    c = c.replace(/(\d{3})(\d)/, '$1.$2');
    c = c.replace(/(\d{3})(\d)/, '$1.$2');
    c = c.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    cpf.val(c)
}

function formatarCEP(){
    let cep = $('#cep')
    let c = cep.val().substring(0,8)
    cep.val(c)
}

function validaFormulario() {
    $('div').remove('.alert')
    let ret = true
    let matricula = $('#matricula')
    if (matricula.val().length !== 10) {
        matricula.after('<div class="alert alert-danger" role="alert">Matricula deve ser preenchida corretamente!</div>')
        ret = false

    }
    let nome = $("#nome")
    if (nome.val().length == 0 || nome.val().length > 100) {
        nome.after('<div class="alert alert-danger" role="alert">\
            Nome deve ser preenchido corretamente!\
            </div>')
    }
    let cpf = $('#cpf')
    if (cpf.val().replace(/\D/g, '').length == 11) {
        if (validarCPF(cpf.val().replace(/\D/g, '')) == false) {
            cpf.after('<div class="alert alert-danger" role="alert">\
                CPF inválido!\
                </div>')
            ret = false
        }

    }
    else {
        cpf.after('<div class="alert alert-danger" role="alert">\
            CPF incompleto!\
            </div>')
        ret = false
    }
    let dataNascimento = $('#data')
    if (dataNascimento.val()) {
        let hoje = new Date();
        let nascimento = new Date(dataNascimento.val());
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        let mes = hoje.getMonth() - nascimento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        if (idade < 14) {
            dataNascimento.after('<div class="alert alert-danger" role="alert">\
                O aluno deve ter pelo menos 14 anos!\
                 </div>')
            ret = false;
        }
    } else {
        dataNascimento.after('<div class="alert alert-danger" role="alert">\
            Data de nascimento é obrigatória!\
            </div>')    
        ret = false;
        
    }
    let cep = $("#cep")
    if (cep.val().length <8){
        cep.after('<div class="alert alert-danger" role="alert">\
            CEP é obrigatório!\
            </div>')    
        ret = false
    }
    let logradouro = $("#logradouro")
    if (logradouro.val().length == 0){
        logradouro.after('<div class="alert alert-danger" role="alert">\
            Logradouro é obrigatório!\
            </div>')    
        ret = false
    }
    let numero = $("#numero")
    if (numero.val().length == 0){
        numero.after('<div class="alert alert-danger" role="alert">\
            Número é obrigatório!\
            </div>')    
        ret = false
    }
    let bairro = $("#bairro")
    if (bairro.val().length == 0){
        bairro.after('<div class="alert alert-danger" role="alert">\
            Bairro é obrigatório!\
            </div>')    
        ret = false
    }
    let cidade = $("#cidade")
    if (cidade.val().length == 0){
        cidade.after('<div class="alert alert-danger" role="alert">\
            Cidade é obrigatória!\
            </div>')    
        ret = false
    }
    let estado = $("#estado")
    if (estado.val().length == 0){
        estado.after('<div class="alert alert-danger" role="alert">\
            Estado é obrigatório!\
            </div>')    
        ret = false
    }
    if($('input[name="sexo"]:checked').length === 0){
        $('fieldset').after('<div class="alert alert-danger" role="alert">\
            Sexo é obrigatório!\
            </div>')    
        ret = false
        
    }
    return ret
}

function validarCPF(cpf) {
    // Remove todos os caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    // Verifica se o CPF tem 11 dígitos e se não é uma sequência de números repetidos
    if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) {
        return false;
    }

    let t1 = 0;
    let t2 = 0;

    // Cálculo do primeiro dígito verificador
    for (let i = 0; i < 9; i++) {
        t1 += parseInt(cpf[i]) * (10 - i);
    }
    t1 = (t1 * 10) % 11;
    if (t1 === 10 || t1 === 11) {
        t1 = 0;
    }

    // Cálculo do segundo dígito verificador
    for (let i = 0; i < 10; i++) {
        t2 += parseInt(cpf[i]) * (11 - i);
    }
    t2 = (t2 * 10) % 11;
    if (t2 === 10 || t2 === 11) {
        t2 = 0;
    }

    // Verifica se os dois dígitos verificadores estão corretos
    return String(t1) === cpf[9] && String(t2) === cpf[10];
}
