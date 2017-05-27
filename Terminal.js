/**
 * JST (Javascript Terminal)
 * Version 1.0.0.0
 * Created By Davenchy
 * Jquery is needed!
 */

function Terminal() {
    try {
        $("<div>Check Jquery");
    } catch (e) { alert("jquery.js is missing"); }
    this.view;
    this.inputBox;
    this.keys = { 13:"enter", 116:"f5", 123:"f12", 38:"up", 40:"down" };
    this.help = [];
    this.history = [];
    this.historyIndex = 0;
    this.outputType = {info:"#2196f3", warn:"#ff9800", message:"#4caf50", error:"#f44336"};
    this.framework = {
        //  Terminal Object
        parent:this,

        //  Clear All Terminal Elements
        clear:function(input) {
            while(this.parent.view.children().length != 0) {
                for(var i = 0; i < this.parent.view.children().length; i++) {
                    this.parent.view.children()[i].remove();
                }
            }
            this.parent.drawInputBox();
        },


        //  Show About Message
        about:function(input) {
            this.parent.eline();
            this.parent.hline();
            this.parent.output("Javascript Terminal", this.parent.outputType.info);
            this.parent.output("Version 1.0.0.0", this.parent.outputType.info);
            this.parent.output("Created By Davenchy", this.parent.outputType.info);
            this.parent.hline();
            this.parent.eline();
        },

        //  Print string [data]
        echo:function(data) {
            if (data.length > 0) { this.parent.output(data, this.parent.outputType.info); }
            else { throw "Tip : echo Message To Print"; }
        },

        //  Split Args by spaces and return array (Under Develop)
        splitArgs:function(argsStr) {
            var data = argsStr.split(" ");
            var args = [];
            for(var i = 0; i < data.length; i++) {
                args.push(data[i]);
            }
            return args;
        }
    };
}

//  Select Terminal Element
Terminal.prototype.setView = function(data) {
    this.view = $(data);
}

//  Append InputBox to the terminal
Terminal.prototype.drawInputBox = function() {
    this.inputBox = $("<input type='text' class='InputBox'>")
    this.view.append(this.inputBox);
    this.inputBox.focus();
}

//  Append html code to Terminal
Terminal.prototype.create = function(data) {
    this.view.append(data);
    this.view.append(this.inputBox);
    this.inputBox.val("");
    this.inputBox.focus();
}

//  Print some string in Terminal
Terminal.prototype.output = function(text, type) {
    this.create("<div class='Line' style='color: " + type + ";'>" + text + "</div>");
}

//  the same as <br>    [Empity Line]
Terminal.prototype.eline = function(text, type) { this.create("<br>"); }

//  the same as <hr>    [Horizontal Line]
Terminal.prototype.hline = function(text, type) { this.create("<hr>"); }

//  On key down event method
Terminal.prototype.onKeyDown = function(e) {
    //console.log(e.keyCode);
    //console.log(this.inputBox.val());
    if (document.activeElement != this.inputBox[0]) {
        if (this.keys[e.keyCode] !== "f5" && this.keys[e.keyCode] !== "f12")
        {
            e.preventDefault();
            this.inputBox.focus();
        }
    } else {
        if (this.keys[e.keyCode] === "enter") {
            this.input();
        }
        if (this.keys[e.keyCode] === "up") {
            if (this.historyIndex <= 0) { this.historyIndex++; }
            this.historyIndex--;
            this.inputBox.val(this.history[this.historyIndex]);
        }
        if (this.keys[e.keyCode] === "down") {
            if (this.historyIndex >= this.history.length-1) { this.historyIndex--; }
            this.historyIndex++;
            this.inputBox.val(this.history[this.historyIndex]);
        }
    }
}

//  On InputBox change event method
Terminal.prototype.input = function() {
    var string = this.inputBox.val();
    if (string != "") { 
        for(var i = 0; i < this.history.length; i++) {
            if (this.history[i] === string) {
                this.history.splice(i, 1);
            }
        }
        if (this.history[this.history.length-1] !== string) {
            this.history.push(string);
        }
        this.output(string, this.outputType.message);
        this.compilor(string);
    }
    this.historyIndex = this.history.length;
}

//  Method to check called codes from the Terminal
Terminal.prototype.compilor = function(code) {
    var cmd = code.split(" ")[0];
    var pars = "";
    if (code.indexOf(cmd + " ") != -1) { 
        pars = code.replace(cmd + " ", "");
    }
    try {
        this.framework[cmd](pars);
    }
    catch (e) { this.output(e, this.outputType.error); }
}