import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse);
};

export { parseCode };
export { parser, clean, tableToDisplay };

let lineNumber = 1;
let tableToDisplay = [];
let row = newRow();

const typeCases = {
    'FunctionDeclaration': parseFuncDeclaration,
    'ReturnStatement': parseReturnState,
    'AssignmentExpression': parseAssignmentExp,
    'ExpressionStatement' : parseExpressionStatement,
    'VariableDeclaration': parseVarDeclaration,
    'BinaryExpression' : parseBinaryExpression,
    'WhileStatement': parseWhileState,
    'IfStatement': parseIfState,
    'BlockStatement': parseBlockState,
    'MemberExpression' : parserMemberExpression,
    'Literal': parseLiteral,
    'Identifier': parseId,
    'UnaryExpression' : parseUnaryExpression
};

function parser(parseMe) {
    let type = parseMe.type;
    row.Line = lineNumber;
    let func = typeCases[type];
    return func ? func.call(undefined, parseMe) : null;
}


function parseFuncDeclaration(bodyElement) {
    row.Type = bodyElement.type;
    row.Name = parser(bodyElement.id);
    tableToDisplay.push(row);
    row = newRow();
    parseParamDeclaration(bodyElement.params);
    // parseVarDeclaration(bodyElement.params);
    parser(bodyElement.body);
}

function parseParamDeclaration(params){
    params.forEach(param => {
        row.Type = 'VariableDeclaration';
        row.Name = parser(param);
        tableToDisplay.push(row);
        row = newRow();
    });
}

function parseVarDeclaration(decl) {
    decl.declarations.forEach(param => {
        row.Type = 'VariableDeclaration';
        row.Name = parser(param.id);
        if(param.init)
            row.Value = parser(param.init);
        else
            row.Value = param.init;
        tableToDisplay.push(row);
        row = newRow();
    });
}

function parseExpressionStatement(exp){
    parser(exp.expression);
}

function parseAssignmentExp(assExp) {
    let left = parser(assExp.left);
    let right = parser(assExp.right);
    row.Type = assExp.type;
    row.Name = left;
    row.Value = right;
    tableToDisplay.push(row);
    row = newRow();
}

function parseBinaryExpression(exp){
    let left = parser(exp.left);
    let right = parser(exp.right);
    let op = exp.operator;
    return left + op + right;
}

function parserMemberExpression(exp){
    let obj = parser(exp.object);
    let prop = parser(exp.property);
    return obj + '[' + prop + ']';
}

function parseWhileState(whileExp) {
    row.Type = whileExp.type;
    row.Condition = parser(whileExp.test);
    tableToDisplay.push(row);
    row = newRow();
    parser(whileExp.body);
}

function parseIfState(ifState) {
    row.Type = ifState.type;
    row.Condition = parser(ifState.test);
    tableToDisplay.push(row);
    row = newRow();
    lineNumber++;
    parser(ifState.consequent);
    lineNumber++;
    parser(ifState.alternate);
}


function parseUnaryExpression(unExp){
    let arg = parser(unExp.argument);
    return unExp.operator + arg;
}

function parseReturnState(ret) {
    row.Type = ret.type;
    row.Value = parser(ret.argument);
    tableToDisplay.push(row);
    row = newRow();
}

function parseId(id) {
    return id.name;
}

function parseLiteral(lit) {
    return lit.value;
}

function parseBlockState(block) {
    block.body.forEach(bodyElement => {
        lineNumber++;
        parser(bodyElement);
    });
}



function newRow() {
    return { Line: '', Type: '', Name: '', Condition: '', Value: ''};
}


function clean(){
    tableToDisplay = [];
    lineNumber = 1;
    row = newRow();
}