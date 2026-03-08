CI / CD Quickstart

This repository includes a GitHub Actions workflow and basic Kubernetes manifests to build, push images to Amazon ECR and deploy to an EKS cluster.

Required GitHub secrets
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION
- AWS_ACCOUNT_ID
- EKS_CLUSTER_NAME

How it works
- On push to `main` or `Develop` the workflow builds backend and frontend images, tags them with `${{ github.sha }}` and `latest`, pushes to ECR, then applies the manifests in `k8s/` and updates the deployments to the new image tags.

Notes
- Replace `REPLACE_WITH_ECR` in the k8s manifests with your ECR registry (or leave as-is; the workflow sets images by tag with `kubectl set image`).
- Create `kanban-secrets` in the cluster from `k8s/secrets-example.yaml` (don't store real secrets in Git). Example:
  kubectl apply -f k8s/secrets-example.yaml

