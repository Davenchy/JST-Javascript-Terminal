/**
 * JST (Javascript Terminal)
 * Version 3.0
 * Created By Davenchy
 * Jquery is needed!
 */

//  Terminal Object
function Terminal(id) {
    
    //  Init
    this.view = document.getElementById(id);
    this.inputBox;
    this.Init();

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
    this.create = {
        terminal: this,
        Line: function(text="", color = this.terminal.color.Blue, style="") { 
            return this.terminal.Draw("<p class='Line' style='color: " + color + "; " + style + "'>" + text + "</p>");
        },
        HLine: function(style="") { return this.terminal.Draw("<hr style='" + style + "'>"); },
        ELine: function(style="") { return this.terminal.Draw("<br><p class='Line' style='" + style + "'></p>"); }
    };
        
    //  Objects And Vars
    this.history = [];
    this.historyIndex = 0;

    //  Framework (Some functions can call from the terminal)
    this.framework = {
        terminal:this,
        clear:function(extra) {

            var children = terminal.view.children;

            while(children.length > 0) {
                terminal.view.removeChild(children[0]);
            }
            
            this.terminal.DrawInputBox();
        },
        about:function(extra) {
            this.terminal.create.ELine();
            this.terminal.create.HLine();
            this.terminal.create.Line("Javascript Terminal", this.terminal.color.Green, "font-weight: 700;");
            this.terminal.create.Line("Version 3.0", this.terminal.color.Green, "font-weight: 700;");
            this.terminal.create.Line("Created By Davenchy", this.terminal.color.Green, "font-weight: 700;");
            this.terminal.create.HLine();
            this.terminal.create.ELine();
        }
    };
}

//  Init
Terminal.prototype.Init = function() {
    this.inputBox = document.createElement("input");
    this.inputBox.setAttribute("class", "InputBox");
    this.inputBox.setAttribute("id", "InputBox");
    var terminal = this;

    document.onkeydown = function(e, t = terminal) {
        terminal.OnKeyDown(e, t);
    }

    this.DrawInputBox();
}

//  Draw InputBox
Terminal.prototype.DrawInputBox = function() {
    var i = document.getElementById("InputBox");
    if (i != null) {
        i.remove();
    }

    this.view.appendChild(this.inputBox);
    this.inputBox.value = "";
    this.inputBox.focus();
}

//  Append html code to Terminal
Terminal.prototype.Draw = function(html) {
    this.view.innerHTML += html;
    var nodes = this.view.childNodes;
    var node = nodes[nodes.length - 1];
    this.DrawInputBox();
    return node;
}

var test = undefined;

//  On Key Down Event Method
Terminal.prototype.OnKeyDown = function(e, terminal) {
    test = terminal;
    if (document.activeElement != terminal.inputBox) {
        if (terminal.keys[e.keyCode] !== "f5" && terminal.keys[e.keyCode] !== "f12")
        {
            e.preventDefault();
            terminal.inputBox.focus();
        }
    } else {
        if (terminal.keys[e.keyCode] === "enter") {
            terminal.OnInputEvent();
        }
        if (terminal.keys[e.keyCode] === "up") {
            e.preventDefault();
            if (terminal.historyIndex <= 0) { terminal.historyIndex++; }
            terminal.historyIndex--;
            terminal.inputBox.value = terminal.history[terminal.historyIndex];
        }
        if (terminal.keys[e.keyCode] === "down") {
            e.preventDefault();
            if (terminal.historyIndex >= terminal.history.length-1) { terminal.historyIndex--; }
            terminal.historyIndex++;
            terminal.inputBox.value = terminal.history[terminal.historyIndex];
        }
    }
}

//  On Input Event Method
Terminal.prototype.OnInputEvent = function() {
    var string = this.inputBox.value;
    if (string !== "") { 
        for(var i = 0; i < this.history.length; i++) {
            if (this.history[i] === string) {
                this.history.splice(i, 1);
            }
        }
        if (this.history[this.history.length-1] !== string) {
            this.history.push(string);
        }

        this.create.Line(string);
        this.Compilor(string);
    }
    this.historyIndex = this.history.length;
}

//  Method to check called codes from the Terminal
Terminal.prototype.Compilor = function(code) {
    var cmd = code.split(" ")[0];
    var extra = "";
    if (code.indexOf(cmd + " ") != -1) { 
        extra = code.replace(cmd + " ", "");
    }
    try { this.framework[cmd](extra); }
    catch (e) { this.create.Line(e, this.color.Red, "font-weight: 700;"); }
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