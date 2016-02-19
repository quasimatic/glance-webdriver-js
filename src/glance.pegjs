Start
 = containers:Container* { return {containers:containers}; }

Container
 = section:Section ContainerChar? { return section; }

Section
 = label:Label position:Index? transform:Transform? { return { label: label, position: position, transform:transform } }

ContainerChar
 = ">"

Label
 = chars:LabelCharacter+ { return chars.join('') }

LabelCharacter
   = !(EscapeChar / ContainerChar / IndexChar / TransformChar) c:Character { return c }
   / c:EscapedSequence { return c }
//   / "\\" sequence:EscapeSequence { return sequence; }
//   / LineContinuation

Character
 = .

EscapedSequence
 = EscapeChar c:(EscapeChar / IndexChar) { return c; }

EscapeChar
 = "\\"

Index
 = IndexChar position:Position { return position; }

IndexChar
 = "#"

Position
 = [0-9]+ { return parseInt(text(), 10); }

Transform
 = TransformChar name:Character+ { return name.join(''); }

TransformChar
 = ":"