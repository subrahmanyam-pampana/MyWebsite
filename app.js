var quetionNum = 1;
var form = document.getElementById("addNewQuetionForm");

function fnshowHide(e) {
    if ($(e).val() == "H") {
        $(e).siblings('.solution-div').show();
        $(e).text("Hide Solution");
        $(e).val("S");
    } else if ($(e).val() == "S") {
        $(e).siblings('.solution-div').hide();
        $(e).text("View Solution");
        $(e).val("H");
    }
}

function fnrenderQuetions(doc) {

    if (doc.data().type == "netType") {

        let htmltext = "<div class='quetionDiv'>" +
            "<p><span class='qno'>" + quetionNum + ". </span>" + doc.data().quetion + "</p>" +
            "<input type='text'><br>" +
            "<button class='Solution-btn' id='btn1' value='H' onclick='fnshowHide(this)'>View solution</button>" +
            "<div class='solution-div'>" +
            "<p>solution: " + doc.data().solution + "</p>" +
            "<textarea placeholder='take your notes here.....'  class = 'userNote'>" + doc.data().note +
            "</textarea></div></div>";

        $(".leftPannel").append(htmltext);

    } else if (doc.data().type == "mcq") {

        let htmltext = "<div class='quetionDiv'>" +
            "<p><span class='qno'>" + doc.data().qno + ". </span>" + doc.data().quetion + "</p>";

        var options = doc.data().options.split(',');
        var id = 1;
        var optionText = '';
        options.forEach(optn => {

            optionText += '<input type="radio" name="option" value = "' + optn + '" > ' +
                '<label for="a">' + optn + '</label><br>';
            id++;
        });

        htmltext += optionText + "<button class='Solution-btn' id='btn1' value='H' onclick='fnshowHide(this)'>View solution</button>" +
            "<div class='solution-div'>" +
            "<p>solution: " + doc.data().solution + "</p>" +
            "<textarea placeholder='take your notes here.....'  class = 'userNote'>" + doc.data().note +
            "</textarea></div></div>";
        $(".leftPannel").append(htmltext);
    }
    quetionNum++;
}
db.collection('quetions').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        fnrenderQuetions(doc);
    })
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    db.collection('quetions').add({
        quetion: form.quetion.value,
        options: form.options.value,
        answer: form.answer.value,
        solution: form.solution.value
    });

});
