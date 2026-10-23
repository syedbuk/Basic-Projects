console.log("Inside Script")



function TipCalculator(){

    let totalBill = document.getElementById("totalbill").value;
    let tipPercent = document.getElementById("tippercentage").value;
    let numPeople = document.getElementById("numpeople").value;

     let tipamount= (totalBill * tipPercent/100);
     let tipPerPerson = tipamount / numPeople;


    document.getElementById("totaltip").textContent = tipamount.toFixed(2);
    document.getElementById("tipperperson").textContent = tipPerPerson.toFixed(2);
}