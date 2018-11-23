import assert from 'assert';
import {parseCode, clean, parser, tableToDisplay} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });
    checkFuncDeclaration();
    checkVarDeclaration();
    checkExpStatement();
    checkWhileStatement();
    checkIfStatement();
    checkReturnStatement();
    checkVarDecl();
    checkNull();
});


function checkFuncDeclaration(){
    it('is parsing a function declaration correctly', () => {
        clean();
        let parsedCode = parseCode('function BinarySearch(x){}');
        parser(parsedCode['body'][0]);
        assert.equal(tableToDisplay[0].Name,'BinarySearch');
        assert.equal(tableToDisplay[0].Line, 1);
        assert.equal(tableToDisplay[0].Type,'FunctionDeclaration');
        assert.equal(tableToDisplay[1].Name,'x');
        assert.equal(tableToDisplay[1].Line, 1);
        assert.equal(tableToDisplay[1].Type,'VariableDeclaration');
    });
}

function checkVarDeclaration(){
    it('is parsing a variable declaration correctly', () => {
        clean();
        let parsedCode = parseCode('let a = 1;');
        parser(parsedCode['body'][0]);
        assert.equal(tableToDisplay[0].Name,'a');
        assert.equal(tableToDisplay[0].Line, 1);
        assert.equal(tableToDisplay[0].Type,'VariableDeclaration');
        assert.equal(tableToDisplay[0].Value,'1');
    });
}

function checkExpStatement(){
    it('is parsing an expression statement correctly', () => {
        clean();
        let parsedCode = parseCode('low = 0');
        parser(parsedCode['body'][0]);
        assert.equal(tableToDisplay[0].Name,'low');
        assert.equal(tableToDisplay[0].Line, 1);
        assert.equal(tableToDisplay[0].Type,'AssignmentExpression');
        assert.equal(tableToDisplay[0].Value,'0');
    });
}

function checkWhileStatement(){
    it('is parsing a while statement correctly', () => {
        clean();
        let parsedCode = parseCode('while(x > 1){}');
        parser(parsedCode['body'][0]);
        assert.equal(tableToDisplay[0].Condition,'x>1');
        assert.equal(tableToDisplay[0].Line, 1);
        assert.equal(tableToDisplay[0].Type,'WhileStatement');
    });
}

function checkIfStatement(){
    it('is parsing a if statement correctly', () => {
        clean();
        let parsedCode = parseCode('if(x<v[mid]) \n x=1; \n else if(x>v[mid]) \n x=0; \n else \n x=-1;');
        parser(parsedCode['body'][0]);
        assert.equal(tableToDisplay[0].Condition,'x<v[mid]');
        assert.equal(tableToDisplay[0].Line, 1);
        assert.equal(tableToDisplay[0].Type,'IfStatement');
        assert.equal(tableToDisplay[2].Condition,'x>v[mid]');
        assert.equal(tableToDisplay[2].Line, 3);
        assert.equal(tableToDisplay[2].Type,'IfStatement');
        assert.equal(tableToDisplay[4].Name,'x');
        assert.equal(tableToDisplay[4].Value,'-1');
        assert.equal(tableToDisplay[4].Line, 5);
        assert.equal(tableToDisplay[4].Type,'AssignmentExpression');
    });
}

function checkReturnStatement(){
    it('is parsing a return statement correctly', () => {
        clean();
        let parsedCode = parseCode('function x(){\n return v[mid];\n }');
        parser(parsedCode['body'][0]);
        assert.equal(tableToDisplay[0].Name,'x');
        assert.equal(tableToDisplay[0].Line, 1);
        assert.equal(tableToDisplay[0].Type,'FunctionDeclaration');
        assert.equal(tableToDisplay[1].Value,'v[mid]');
        assert.equal(tableToDisplay[1].Line, 2);
        assert.equal(tableToDisplay[1].Type,'ReturnStatement');
    });
}

function checkVarDecl(){
    it('is parsing a var decl correctly', () => {
        clean();
        let parsedCode = parseCode('let low,high,mid;');
        parser(parsedCode['body'][0]);
        assert.equal(tableToDisplay[0].Name,'low');
        assert.equal(tableToDisplay[0].Line, 1);
        assert.equal(tableToDisplay[0].Type,'VariableDeclaration');
        assert.equal(tableToDisplay[0].Value,null);
        assert.equal(tableToDisplay[1].Name,'high');
        assert.equal(tableToDisplay[1].Line, 1);
        assert.equal(tableToDisplay[1].Type,'VariableDeclaration');
        assert.equal(tableToDisplay[1].Value,null);
        assert.equal(tableToDisplay[2].Name,'mid');
        assert.equal(tableToDisplay[2].Line, 1);
        assert.equal(tableToDisplay[2].Type,'VariableDeclaration');
        assert.equal(tableToDisplay[2].Value,null);
    });
}

function checkNull(){
    it('is parsing a wrong code correctly', () => {
        clean();
        let parsedCode = parseCode('wrongcode');
        assert.equal(parser(parsedCode['body'][0]), null);
    });
}