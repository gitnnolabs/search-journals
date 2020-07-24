// usado para fazer paginação de painel de documentos citantes - entrada por página digitada
function goto_citing_docs_page_by_input(obj, event, cmd) {
    if (event.keyCode == 13) {
        new_page = $(obj).val();
        citation_info = cmd.split(',');
        citation_info.push(new_page);
        goto_citing_docs_page(citation_info.join(','));
    }
}

// usado para fazer paginação de painel de documentos citantes - entrada por incremento de página
function goto_citing_docs_page(cmd) {
    console.log(cmd);
    els = cmd.split(",");
    cit_id = els[0];
    lang = els[1];
    page = els[2];

    $.ajax({
        type: "get",
        dataType: "html",
        url: "citing-documents/" + cit_id + "/?lang=" + lang + '&page=' + page,
        success: function (data) {
            modal_div_citing_docs = $("#modalCitingDocument-" + cit_id)[0];
            modal_div_citing_docs.innerHTML = data;
        }
    });
}

// usado para fazer paginação
function go_to_page(page) {
    var count = document.searchForm.count.value;
    var from = (page*count)-count+1;

    var url = new URL(document.URL);
    url.searchParams.set("from", from);
    url.searchParams.set("page", page);
    window.location = url.toString();
}

// usado para mudar a forma de exibição do dado (xml/rss/print/site)
function change_output(output) {
    var form = document.searchForm;
    form.output.value = output;

    $("#searchForm").submit();
    form.output.value = "site"; //return to default output
}

// muda a quantidade de resultados exibidos
function change_count(elem) {
    var form = document.searchForm;
    form.count.value = elem.value;

    $("#searchForm").submit();
}

// muda o parâmetro lang
function change_language(lang) {
    if (RESULT_PAGE){
        var form = document.searchForm;
        form.lang.value = lang;
        $("#searchForm").submit();
    }else{
        document.language.lang.value = lang;
        document.language.submit();
    }
}

// muda a quantidade de resultados exibidos
function change_format(elem) {
    var form = document.searchForm;
    form.format.value = elem.value;

    $("#searchForm").submit();
}

function print_record(q) {
    var form = document.searchForm;
    form.q.value = q;
    print_page(1);
}

// leva para output "print", passando o count
function print_page(count) {
    var form = document.searchForm;
    if(count)
        form.count.value = count;
    else
        form.count.value = 300;

    change_output("print");
}


function export_record(q) {
    var form = document.searchForm;
    form.q.value = q;
    export_result(1);
}

// leva para output "ris/citation/csv", passando o count
function export_result(count) {

    var form = document.searchForm;
    var previous_count = form.count.value;
    var output = getCheckedValue(document.exportForm.format);

    if(count)
        form.count.value = count;
    else
        form.count.value = -1;

    change_output(output);
    form.count.value = previous_count;    //return to previous value
}

function export_xml_record(q) {
    var form = document.searchForm;
    form.q.value = q;

    change_output("xml");
}

// advanced search
function decs_locator(base_url) {
    $("#searchForm").attr("action",base_url + "decs-locator/");
    $("#searchForm").submit();
}


/**
 * Mostra janela com grafico do cluster selecionado
 * @param {Node} obj
 * @param {String} titulo
 * @param {String} id
 */
function open_chart(obj, titulo, id){
    var regex = /\(\d+\)/;
    var params= "";

    var grupo = document.getElementById("ul_" + id);
    var lista = grupo.getElementsByTagName('li');

    for (i = 0; i < lista.length; i++){
        cluster = lista[i].innerHTML;
        clusterLabel = lista[i].getElementsByTagName('a')[0].innerHTML;

        ma = regex.exec(cluster);
        if (ma != null) {
            clusterTotal = ma[0].replace(/[()]/g,'');
            params += "&l[]=" + clusterLabel.trim() + "&d[]=" + clusterTotal.trim();
        }
    }
    // caso seja o cluster de ano passa parametro para realizar sort
    if (id == 'year_cluster'){
        params += "&sort=true";
    }
    url = "chart/?title=" + titulo + params + "&KeepThis=true&TB_iframe=true&height=480&width=650";
    obj.href = url;
}

// return the value of the radio button that is checked
// return an empty string if none are checked, or
// there are no radio buttons
function getCheckedValue(radioObj) {
    if(!radioObj)
        return "";
    var radioLength = radioObj.length;
    if(radioLength == undefined)
        if(radioObj.checked)
            return radioObj.value;
        else
            return "";
    for(var i = 0; i < radioLength; i++) {
        if(radioObj[i].checked) {
            return radioObj[i].value;
        }
    }
    return "";
}

function change_sort(obj){
    var sort = obj.options[obj.selectedIndex].value;
    var form = document.searchForm;

    form.sort.value = sort;
    $("#searchForm").submit();
}
