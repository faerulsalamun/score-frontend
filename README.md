# Score App - Frontend

This is the frontend for the Score App, a Polymer challenged Weekend Quest: Build a Betting App 🏀

## Getting Started

### Prerequisites

You need to deploy the Score contract on the Optimism (Sepolia) network and the Base (Sepolia) network. You can use the following repository to deploy the contracts:

[https://github.com/faerulsalamun/score-smart-contract](https://github.com/faerulsalamun/score-smart-contract)

You will get the contract addresses after deploying the contracts.

### Installation

1. Clone this repository.
2. Copy `.env.example` to `.env.local`.
3. Edit the following values:
   - `NEXT_PUBLIC_OPTIMISM_PORTADDR` - The address of the Score contract on the Optimism (Sepolia) network.
   - `NEXT_PUBLIC_BASE_PORTADDR` - The address of the Score contract on the Base (Sepolia) network.
4. Run `npm install` to install the dependencies.
5. Run `npm run dev` to start the development server.
6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

Join the [Polymer Labs Community](https://linktr.ee/polymerdao) and build together.

## License

Distributed under the MIT License.