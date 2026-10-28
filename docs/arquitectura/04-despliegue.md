# Despliegue (Corte 3)

```mermaid
flowchart LR
    DEV["💻 Laptop<br/>git push"] --> GH["GitHub<br/>lanvargas94/biblio-huila"]
    GH --> GA["GitHub Actions<br/>ci-cd.yml"]
    GA -->|"docker push (solo main)"| GHCR["GHCR<br/>biblio-huila-api:SHA<br/>biblio-huila-web:SHA"]
    GA -->|"SSH + compose.prod.yml"| EC2
    subgraph EC2["EC2 t3.micro · Amazon Linux 2023 (1 GB + swap)"]
        direction TB
        W["web :80<br/>mem_limit 64m"] --> A["api :3000 (interno)<br/>mem_limit 256m"]
        A --> V[("volumen datos")]
    end
    GHCR -->|docker compose pull| EC2
    U["👤 Usuarios"] -->|"HTTP :80"| W
```

Security Group: entrada solo 80 (y 22 restringido a la IP del pipeline o de quien administra).
Costo de referencia: t3.micro ≈ US$0,0104/h; apagarla y borrarla al terminar la práctica.
