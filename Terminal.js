/**
 * JST (Javascript Terminal)
 * Version 2.0
 * Created By Davenchy
 * Jquery is needed!
 */

//  Terminal Object
function Terminal(selector) {
    try { $("<div>Check Jquery</div>"); } catch (e) { alert("jquery.js is missing"); }
    
    //  Init
    this.view = $(selector);
    this.inputBox;
    this.SetInputBox();
    this.RefreshInputBox();

    //  Input Keys
    this.keys = { 13:"enter", 116:"f5", 123:"f12", 38:"up", 40:"down" };

    //  Colors
    this.color = {
        "Red": "#F44336",
        "Pink": "#E91E63",
        "Purple": "#9C27B0",
        "Indigo": "#3F51B5",
        "Blue": "#2196F3",
        "LightBlue": "#03A9F4",
        "Teal": "#009688",
        "Green": "#4CAF50",
        "LightGreen": "#8BC34A",
        "Lime": "#CDDC39",
        "Yellow": "#FFEB3B",
        "Orange": "#FF9800",
        "White": "#E0E0E0"
    };

    //  Create And Draw Objects Method
    this.Create = {
        parent: this,
        Line: function(text="", color = this.parent.color.Blue, style="") { 
            return this.parent.Draw("<p class='Line' style='color: " + color + "; " + style + "'>" + text + "</p>");
        },
        HLine: function(style="") { return this.parent.Draw("<hr style='" + style + "'>"); },
        ELine: function(style="") { return this.parent.Draw("<br><p class='Line' style='" + style + "'></p>"); }
    };
        
    //  Objects And Vars
    this.history = [];
    this.historyIndex = 0;

    //  Framework (Some functions can call from the terminal)
    this.framework = {
        parent:this,
        clear:function(input) {
            while(this.parent.view.children().length !== 0) {
                for(var i = 0; i < this.parent.view.children().length; i++) {
                    this.parent.view.children()[i].remove();
                }
            }
            this.parent.SetInputBox();
            this.parent.RefreshInputBox();
        },
        about:function(input) {
            this.parent.Create.ELine();
            this.parent.Create.HLine();
            this.parent.Create.Line("Javascript Terminal", this.parent.color.Green, "font-weight: 700;");
            this.parent.Create.Line("Version 2.0", this.parent.color.Green, "font-weight: 700;");
            this.parent.Create.Line("Created By Davenchy", this.parent.color.Green, "font-weight: 700;");
            this.parent.Create.HLine();
            this.parent.Create.ELine();
        }
    };
}

//  Set InputBox
Terminal.prototype.SetInputBox = function() { this.inputBox = $("<input type='text' class='InputBox'>"); }

//  Reset InputBox
Terminal.prototype.RefreshInputBox = function() {
    this.view.append(this.inputBox);
    this.inputBox.val("");
    this.inputBox.focus();
}

//  Append html code to Terminal
Terminal.prototype.Draw = function(element) {
    var obj = $(element);
    this.view.append(obj);
    this.RefreshInputBox();
    return obj;
}

//  On Key Down Event Method
Terminal.prototype.OnKeyDown = function(e) {
    if (document.activeElement != this.inputBox[0]) {
        if (this.keys[e.keyCode] !== "f5" && this.keys[e.keyCode] !== "f12")
        {
            e.preventDefault();
            this.inputBox.focus();
        }
    } else {
        if (this.keys[e.keyCode] === "enter") {
            this.OnInputEvent();
        }
        if (this.keys[e.keyCode] === "up") {
            e.preventDefault();
            if (this.historyIndex <= 0) { this.historyIndex++; }
            this.historyIndex--;
            this.inputBox.val(this.history[this.historyIndex]);
        }
        if (this.keys[e.keyCode] === "down") {
            e.preventDefault();
            if (this.historyIndex >= this.history.length-1) { this.historyIndex--; }
            this.historyIndex++;
            this.inputBox.val(this.history[this.historyIndex]);
        }
    }
}

//  On Input Event Method
Terminal.prototype.OnInputEvent = function() {
    var string = this.inputBox.val();
    if (string !== "") { 
        for(var i = 0; i < this.history.length; i++) {
            if (this.history[i] === string) {
                this.history.splice(i, 1);
            }
        }
        if (this.history[this.history.length-1] !== string) {
            this.history.push(string);
        }

        this.Create.Line(string);
        this.Compilor(string);
    }
    this.historyIndex = this.history.length;
}

//  Method to check called codes from the Terminal
Terminal.prototype.Compilor = function(code) {
    var cmd = code.split(" ")[0];
    var pars = "";
    if (code.indexOf(cmd + " ") != -1) { 
        pars = code.replace(cmd + " ", "");
    }
    try { this.framework[cmd](pars); }
    catch (e) { this.Create.Line(e, this.color.Red, "font-weight: 700;"); }
}

//  Split Args by splitter and return array
Terminal.prototype.GetArgs = function(argsStr, splitter = " ") {
    var data = argsStr.split(splitter);
    var args = [];
    for(var i = 0; i < data.length; i++) {
        args.push(data[i]);
    }
    return args;
}