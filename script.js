function buscarCursos(){
    var params = "";
    const curso = $('#curso').val();
    $('td').remove('.c-t');
    $.ajax({
        type: "GET",  
        url: `https://ingresso.ifrs.edu.br/prematricula/ws/listarCursosIW20242.php?curso=${curso}`,
        data: params,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(msg, status) {
            console.log('Resposta da API:', msg);
            tbody = $('.c-tbody')
            tbody.empty()
            msg.forEach(element => {
                tbody.append(
                    `<tr>\
                    <td class="c-t"><input class="form-check-input" type="radio" name="selecao" id="${element.id}"></td>\
                    <td class="c-t">${element.nome}</td>\
                    <td class="c-t">${element.modalidade}</td>\
                    <td class="c-t">${element.semestre}</td>\
                    <td class="c-t">${element.turno}</td>\
                    <td class="c-t">${element.unidade.nomeCampus}</td>\
                    </tr>`
                )
            });
            if (!$.fn.dataTable.isDataTable('#tabela-cursos')) {
                $('#tabela-cursos').DataTable({searching: false});
            }
        },
        error: function(xhr, msg, e) {
            console.error('Erro na requisição:'); 
        }
    });
}



function validarSelecao(event){
    event.preventDefault()
    const checkbox = $('input[name="selecao"]:checked');    
    if(checkbox.length == 0){
        ret = false
        alert('Algum curso deve ser selecionado!')
    }
    else{
        const id = checkbox.attr('id')
        window.location.href = `formulario_curso.html?id=${id}`;
    }

}
function upper() {
    $("#nome").val($("#nome").val().toUpperCase())
 }
function validarFormulario(){
    ret = true
    $('div').remove('.alert')
    if(!$("#nome").val() || $("#nome").val().length > 100){
        $("#nome").after('<div class="alert alert-danger" role="alert">\
                Nome deve ser informado corretamente!\
            </div>')
        ret = false
    }
    if($('input[name="turno"]:checked').length == 0){
        $("#turno").after('<div class="alert alert-danger" role="alert">\
                Algum turno deve ser marcado!\
            </div>')
        ret = false
    }
    
    if(!$('#semestre').val() || $('#semestre').val() !== '1' && $('#semestre').val() !== '2'){
        $("#semestre").after('<div class="alert alert-danger" role="alert">\
                Semestre deve estar entre 1 e 2!\
            </div>')
        ret = false
    }
    return ret
}

$(document).ready(function(){
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('id');
    var params = "";
    $.ajax({
        type: "GET",  
        url: `https://ingresso.ifrs.edu.br/prematricula/ws/pegarCursoIW20242.php?id=${cursoId}`,
        data: params,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(msg, status) {
            $('#nome').val(msg.nome)
            $(`input[name="modalidade"][value="${msg.modalidade}"]`).prop('checked', true);
            let turno = msg.turno
            turno = turno.split(' E ')
            turno.forEach(element=>{
                $(`input[name="turno"][value="${element}"]`).prop('checked', true);

            })
            $('#semestre').val(msg.semestre)
            $('#campus').val(msg.unidade.nomeCampus)

        },
        error: function(xhr, msg, e) {
            console.error('Erro na requisição:'); 
        }
    });

})

