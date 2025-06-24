const input_tk = document.getElementById("input_tk");
const input_mk = document.getElementById("input_mk");
const labelUserName = document.getElementById("labelUsername")
const spanUsername = document.getElementById("spanUsername")
const labelPassWord = document.getElementById("labelPassword")
const spanPassWord = document.getElementById("spanPassword")
const sumbit_btn = document.getElementById("sumbit_btn")


function addCssClickIn(label_evt, span_evt, input_evt) {
  label_evt.classList.add("change1");
  span_evt.classList.add("show1");
  input_evt.focus();
  input_evt.classList.add("background_input")
}
 function removeClickOut(label_evt, span_evt, input_evt) {
    label_evt.classList.remove("change1");
    span_evt.classList.remove("show1");
    input_evt.classList.remove("background_input")
}
document.addEventListener("click", (evt) => {

  let targetEl = evt.target;
  if (targetEl != input_tk && targetEl != labelUserName && input_tk.value == "") {
    labelUserName.classList.remove("change1");
    spanUsername.classList.remove("show1");
    input_tk.classList.remove("background_input")
   console.log()


  }
  if (targetEl != input_mk && targetEl != labelPassWord && input_mk.value == "") {
    labelPassWord.classList.remove("change1");
    spanPassWord.classList.remove("show1");
    input_mk.classList.remove("background_input")
  }

});
document.addEventListener("click", (e) => {
  let sumbit_target = e.target;
  if (sumbit_target == sumbit_btn) {
    sumbit_btn.classList.add("sumbit_jsad");
   console.log("a")
    return;
  }
});
document.addEventListener("keyup", function(event) {

if (event.keyCode == 9) {
      activeElement = document.activeElement;

  if (activeElement == input_tk) {
    addCssClickIn(labelUserName, spanUsername, input_tk);
  } else if (activeElement == input_mk) {
    addCssClickIn(labelPassWord, spanPassWord, input_mk);
  }
}
});
document.addEventListener("keydown", function(event) {

if (event.keyCode == 9) {
      activeElement = document.activeElement;

  if (activeElement == input_tk && input_tk.value == "") {
    removeClickOut(labelUserName, spanUsername, input_tk);
  } else if (activeElement == input_mk  && input_tk.value == "") {
    removeClickOut(labelPassWord, spanPassWord, input_mk);
  }
}
});
window.addEventListener('load', function() {
if ( input_tk.value ) {
    addCssClickIn(labelUserName, spanUsername, input_tk);
  } else if (input_mk.value != "") {
    addCssClickIn(labelPassWord, spanPassWord, input_mk);
  }});