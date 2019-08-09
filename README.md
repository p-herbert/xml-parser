# Parse XML

## Installation

~~~
npm install
~~~

## Tests

Unit tests are provided in the folderb `__tests__`. To run them

~~~
npm run test
~~~

## Functions

- `tokenize(xmlString: String) -> [String]`

> Takes an XML string and returns an array of tokens.


- `parseXML(xmlString: String) -> Tree { value: String, children: [ Tree? ], parent:
  Tree? }`

> Takes an XML string and returns a tree representing the hierarchy.


## Assumptions

- Plain XML without any attributes
- No prolog tag
- Data can exist outside of tags
