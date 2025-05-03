export const generateMermaidDiagram = async (prompt: string, diagramType: string): Promise<string> => {
  if (shouldUseMock()) {
    // For demo purposes, simulate API call with a delay
    console.log('Using MOCK generation with prompt:', prompt);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a sample diagram based on the diagram type
    if (diagramType === 'flowchart') {
      return `flowchart TD
    A[Start] --> B{Is it raining?}
    B -->|Yes| C[Take umbrella]
    B -->|No| D[Enjoy the sun]
    C --> E[Go outside]
    D --> E
    E --> F[End]`;
    } else if (diagramType === 'sequence') {
      return `sequenceDiagram
    participant User
    participant System
    
    User->>System: Request data
    System-->>User: Return results
    
    Note over User: User thinks about the data
    Note over System: System processes request
    
    Note over User,System: Communication established`;
    } else if (diagramType === 'class') {
      return `classDiagram
    class Animal {
      +name: string
      +age: int
      +makeSound(): void
    }
    class Dog {
      +breed: string
      +fetch(): void
    }
    class Cat {
      +color: string
      +climb(): void
    }
    Animal <|-- Dog
    Animal <|-- Cat`;
    } else if (diagramType === 'er') {
      return `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`;
    } else if (diagramType === 'gantt') {
      return `gantt
    title A Gantt Diagram
    dateFormat YYYY-MM-DD
    section Section
    A task           :a1, 2023-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2023-01-12, 12d
    another task     :24d`;
    } else if (diagramType === 'pie') {
      return `pie title Distribution
    "Category A" : 42.96
    "Category B" : 26.08
    "Category C" : 30.96`;
    } else if (diagramType === 'state') {
      return `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`;
    } else if (diagramType === 'journey') {
      return `journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me`;
    } else {
      return `graph TD
    A[${prompt.substring(0, 20)}...] --> B[Generated]
    B --> C[Diagram]
    C --> D[Example]`;
    }
  }
  
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ API key is required. Please check your environment variables.');
    }
    
    // Get the correct syntax prefix based on diagram type
    const syntaxPrefix = getDiagramSyntaxPrefix(diagramType);
    const exampleDiagram = getExampleDiagram(diagramType);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'compound-beta', // Change to 'compound-beta' if available
        messages: [
          {
            role: 'system',
            content: `You are a diagram expert specializing in creating Mermaid syntax diagrams. 
            When given a request, respond ONLY with valid Mermaid syntax code for a ${diagramType} diagram.
            The diagram should start with the syntax: ${syntaxPrefix}
            
            Here's an example of a valid ${diagramType} diagram:
            ${exampleDiagram}
            
            Follow the exact syntax rules of Mermaid. For sequence diagrams, use proper note syntax:
            - For notes over one participant: "Note over ParticipantName: Text"
            - For notes between participants: "Note over Participant1,Participant2: Text"
            
            Do not include any explanations, markdown code blocks, or anything else outside the code.
            Ensure the diagram is clean, well-organized, and correctly formatted.`
          },
          {
            role: 'user',
            content: `Create a ${diagramType} diagram based on this description: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate diagram');
    }
    
    // Extract the Mermaid code from the response
    let content = data.choices[0].message.content;
    
    // Remove any markdown code block syntax if present
    content = content.replace(/```mermaid\n|\n```|`/g, '').trim();
    
    // Ensure the diagram has the correct syntax prefix
    if (!content.startsWith(syntaxPrefix)) {
      content = syntaxPrefix + '\n' + content;
    }
    
    // Fix common syntax errors in sequence diagrams
    if (diagramType === 'sequence') {
      content = fixSequenceDiagramSyntax(content);
    }
    
    return content;
  } catch (error) {
    console.error('Error generating diagram:', error);
    throw error;
  }
};

// Helper function to fix common syntax errors in sequence diagrams
const fixSequenceDiagramSyntax = (content: string): string => {
  // Fix note syntax - ensure proper format for notes
  return content
    // Fix note syntax with quotes
    .replace(/note\s+"([^"]+)"\s+over\s+(\w+)/gi, 'Note over $2: $1')
    // Fix note syntax without quotes
    .replace(/note\s+([^"]+)\s+over\s+(\w+)/gi, 'Note over $2: $1')
    // Fix note syntax between participants
    .replace(/note\s+over\s+(\w+)\s*,\s*(\w+)\s*:\s*([^"\n]+)/gi, 'Note over $1,$2: $3')
    // Ensure participant lines are correct
    .replace(/participant\s+([^"]+)\s+as\s+([^"\n]+)/gi, 'participant $1 as "$2"');
};

// Helper function to get the correct syntax prefix for each diagram type
const getDiagramSyntaxPrefix = (diagramType: string): string => {
  switch (diagramType) {
    case 'flowchart':
      return 'flowchart TD';
    case 'sequence':
      return 'sequenceDiagram';
    case 'class':
      return 'classDiagram';
    case 'er':
      return 'erDiagram';
    case 'gantt':
      return 'gantt';
    case 'pie':
      return 'pie title';
    case 'state':
      return 'stateDiagram-v2';
    case 'journey':
      return 'journey';
    default:
      return 'flowchart TD';
  }
};

// Helper function to get example diagrams for each type
const getExampleDiagram = (diagramType: string): string => {
  switch (diagramType) {
    case 'sequence':
      return `sequenceDiagram
    participant Alice
    participant Bob
    
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I'm good thanks!
    
    Note over Alice: Alice thinks
    Note over Alice,Bob: A note over both Alice and Bob`;
    
    case 'flowchart':
      return `flowchart TD
    A[Start] --> B{Is it raining?}
    B -->|Yes| C[Take umbrella]
    B -->|No| D[Enjoy the sun]
    C --> E[Go outside]
    D --> E`;
    
    case 'class':
      return `classDiagram
    class Animal {
      +name: string
      +makeSound(): void
    }
    class Dog {
      +fetch(): void
    }
    Animal <|-- Dog`;
    
    case 'er':
      return `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains`;
    
    case 'gantt':
      return `gantt
    title Project Schedule
    dateFormat YYYY-MM-DD
    section Phase 1
    Task 1 :a1, 2023-01-01, 30d
    Task 2 :after a1, 20d`;
    
    case 'pie':
      return `pie title Distribution
    "Category A" : 42.96
    "Category B" : 26.08
    "Category C" : 30.96`;
    
    case 'state':
      return `stateDiagram-v2
    [*] --> State1
    State1 --> State2
    State2 --> [*]`;
    
    case 'journey':
      return `journey
    title My Journey
    section Section 1
      Task 1: 5: Me
      Task 2: 3: Me`;
    
    default:
      return `flowchart TD
    A[Start] --> B[End]`;
  }
};

// Helper function to determine if we should use mock data
const shouldUseMock = (): boolean => {
  return import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_GROQ_API_KEY;
};
