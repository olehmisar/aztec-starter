# Devnet Container

This branch exists as a template to create a Github codespace from, for interacting with the devnet. Creating a cocdespace using this template should create a machine with 4 cores, 16GB of RAM and 32 GB of storage. You could also create a machine with 8 cores, 32 GB of RAM and 64 GB of storage for better performance.

Make sure you compile your contracts with `aztec-nargo` that is pulled from the `devnet` docker image (which should be automatically installed if you create a codespace from this repo). You can install the appropriate version on your local machine with:

```
VERSION=devnet aztec-up
```

## Create a codespace

You can click the "Code" button above the repo details and click the "Codespaces" tab. Click the "+" to create a new codespace.

![image](https://github.com/user-attachments/assets/f050481d-d2ec-43d7-983d-ddfd327509b6)
