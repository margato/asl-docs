// Source: asl/architecture.mmd (classDefs recolored for the dark theme)
export const architecture = `flowchart LR
    subgraph EXT["Extensibility"]
        direction TB
        SCHEMA_FILES["Custom Schemas"]
        POLICY_FILES["Custom Policies"]
    end

    subgraph KERNEL["ASL Kernel · Go"]
        direction TB
        API["Public API"]

        subgraph COMPONENTS["Kernel Components"]
            direction TB
            PARSER["Parser"]
            COMPILER["Compiler"]
            SCHEMAS["Schemas Loader"]
            POLICIES["Policy Engine"]
            BUILTIN_S["Built-in Schemas"]
            BUILTIN_P["Built-in Policies"]
        end

        API --> PARSER
    end

    subgraph PYTHON["Python"]
        direction TB
        PY["Python Application"]
        PYSDK["ASL Python SDK"]
        ABI["C ABI Binding"]

        PY --> PYSDK --> ABI
    end

    subgraph BROWSER["Browser"]
        direction TB
        WEB["Web UI"]
        JSSDK["ASL JavaScript SDK"]
        WASM["WebAssembly Binding"]

        WEB --> JSSDK --> WASM
    end

    subgraph GOAPP["Go"]
        direction TB
        GO["Main"]

    end

    PARSER --> SCHEMAS
    PARSER --> COMPILER
    COMPILER --> POLICIES

    SCHEMAS --> BUILTIN_S
    POLICIES --> BUILTIN_P

    SCHEMAS --> SCHEMA_FILES
    POLICIES --> POLICY_FILES

    ABI --> API
    WASM --> API
    GO --> API


    classDef adapter fill:#1c1606,stroke:#ffcc00,color:#f3e6bd
    classDef core fill:#0b2418,stroke:#22c55e,color:#bbf7d0
    classDef api fill:#2a1d07,stroke:#f59e0b,color:#fde68a
    classDef extension fill:#04202a,stroke:#22d3ee,color:#a5f3fc
    classDef builtin fill:#141416,stroke:#6b7280,color:#d1d5db

    class PY,PYSDK,ABI,WEB,JSSDK,WASM,GO,GOLIB adapter
    class PARSER,COMPILER,SCHEMAS,POLICIES core
    class API api
    class SCHEMA_FILES,POLICY_FILES extension
    class BUILTIN_S,BUILTIN_P builtin`;
