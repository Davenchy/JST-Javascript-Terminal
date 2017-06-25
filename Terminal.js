/* 
 *
 * Javascript Terminal (JST)
 * Created By Davenchy And Some ♥
 * Tools Version 4.0
 *
*/

//  Material Colors
var Color = {
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

//  Terminal Object
function Terminal(id) {

    //  Init
    this.view = document.getElementById(id);
    this.inputBox;
    this.compilor = eval;
    this.type = Terminal;
    this.version = "4.0";
    this.about = "Created By Davenchy With Some &lt/&gt And ♥";
    this.echo = false;
    this.Init();

    //  Input Keys
    this.keys = { 13: "enter", 116: "f5", 123: "f12", 38: "up", 40: "down" };

    //  Terminal Lines
    this.lines = [];

    //  History Memory
    this.history = [];
    this.historyIndex = 0;

    //  Create Lines
    //  Create And Draw Objects Method
    this.create = {
        terminal: this,
        Line: function (text = "", color = Color.Blue, style = "") {
            return this.terminal.Draw("<p class='Line' style='color: " + color + "; " + style + "'>" + text + "</p>");
        },
        HLine: function (style = "") { return this.terminal.Draw("<hr style='" + style + "'>"); },
        ELine: function (style = "") { return this.terminal.Draw("<br><p class='Line' style='" + style + "'></p>"); }
    };
    
}

//  Init
Terminal.prototype.Init = function () {
    //  Setup Terminal
    var terminal = this;
    document.onkeydown = function (e, t = terminal) { terminal.OnKeyDown(e, t); };
    MainTerminal = terminal;

    //  Setup Input Box
    this.DrawInputBox();
}

//  Draw InputBox
Terminal.prototype.DrawInputBox = function () {
    this.inputBox = document.createElement("input");
    this.inputBox.setAttribute("class", "InputBox");
    this.inputBox.setAttribute("id", "InputBox");

    this.view.appendChild(this.inputBox);
    this.inputBox.value = "";
    this.inputBox.focus();
}

//  Append html code to Terminal
Terminal.prototype.Draw = function (html) {
    this.Clear();
    this.lines.push(html);
    this.Update();
    return this.lines.length - 1;
}

Terminal.prototype.Clear = function () {
    terminal.view.innerHTML = "";
}

Terminal.prototype.Reset = function () {
    this.Clear();
    this.lines = [];
    this.Update();
}

Terminal.prototype.Update = function (linesArray = null) {
    if (linesArray == null) { linesArray = this.lines; }
    for (i in linesArray) {
        var line = linesArray[i];
        terminal.view.innerHTML += line;
    }
    this.DrawInputBox();
}

//  On Key Down Event
Terminal.prototype.OnKeyDown = function (e, terminal) {
    test = terminal;
    if (document.activeElement.id != terminal.inputBox.id) {
        if (terminal.keys[e.keyCode] !== "f5" && terminal.keys[e.keyCode] !== "f12") {
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
            if (terminal.historyIndex >= terminal.history.length - 1) { terminal.historyIndex--; }
            terminal.historyIndex++;
            terminal.inputBox.value = terminal.history[terminal.historyIndex];
        }
    }
}

//  On Input Event Method
Terminal.prototype.OnInputEvent = function () {
    var string = this.inputBox.value;
    if (string !== "") {
        for (var i = 0; i < this.history.length; i++) {
            if (this.history[i] === string) {
                this.history.splice(i, 1);
            }
        }
        if (this.history[this.history.length - 1] !== string) {
            this.history.push(string);
        }

        this.Compilor(string);
    }
    this.historyIndex = this.history.length;
}

//  Method to check called codes from the Terminal
Terminal.prototype.Compilor = function (code) {
    if (this.echo) { this.create.Line(code); }
    try {
        var output = this.compilor(code);
        this.create.Line(output, Color.Green, "font-weight: 700;");
    }
    catch (error) { this.create.Line(error, Color.Red, "font-weight: 700;"); }
}

//  Tools
var MainTerminal = null;

log = function(text, color, style) { MainTerminal.create.Line(text, color, style); }
clear = function() { MainTerminal.Reset(); }