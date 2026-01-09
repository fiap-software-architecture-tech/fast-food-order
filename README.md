# Fast Food Order Service

Serviço de gerenciamento de pedidos do sistema Fast Food.

## Características

- **Runtime**: Node.js 18.x
- **Database**: RDS MySQL (fastfood_order)
- **Infrastructure**: AWS Lambda + API Gateway
- **Deployment**: Terraform

## API Endpoints

### GET /orders
Lista todos os pedidos

### POST /orders
Cria um novo pedido

**Body Example:**
```json
{
  "customer_id": "123",
  "items": [
    {"product_id": "1", "quantity": 2, "price": 15.90},
    {"product_id": "2", "quantity": 1, "price": 8.50}
  ],
  "total_amount": 40.30
}
```

## Estrutura do Projeto

```
fast-food-order/
├── src/
│   └── index.js          # Handler do Lambda
├── terraform/
│   ├── main.tf           # Infraestrutura principal
│   ├── variables.tf      # Variáveis
│   ├── outputs.tf        # Outputs
│   ├── providers.tf      # Providers AWS
│   └── terraform.tfvars.example
├── build-package.sh      # Script de build
├── package.json          # Dependências Node.js
└── README.md
```

## Deploy

### 1. Build do Lambda
```bash
npm run build
```

### 2. Deploy da infraestrutura
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

## Configurações de Ambiente

O Lambda é automaticamente configurado com:
- `DB_HOST`: Endpoint do RDS order
- `DB_PORT`: 3306
- `DB_NAME`: fastfood_order
- `DB_USER`: admin
- `DB_PASSWORD`: admin123

## Dependências

- Database infrastructure deve estar deployada (`fast-food-db-infra`)
- RDS fastfood_order deve estar disponível
- VPC e Security Groups configurados

## Endpoints de Produção

Após o deploy, o endpoint estará disponível em:
```
https://{api_id}.execute-api.us-east-1.amazonaws.com/production/orders
```

## Troubleshooting

### Lambda Timeout
- Verificar conectividade com RDS
- Validar configurações de VPC
- Checar security groups

### Database Connection
- Verificar credenciais
- Confirmar endpoint do RDS
- Validar network ACLs
