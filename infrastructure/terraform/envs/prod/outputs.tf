output "frontend_url" {
  value = "http://${module.frontend_alb.dns_name}"
}

output "backend_url" {
  value = "http://${module.backend_alb.dns_name}"
}

output "rds_endpoint" {
  value = module.rds.endpoint
}

output "ecs_cluster_name" {
  value = module.ecs_cluster.cluster_name
}

output "backend_ecs_service_name" {
  value = module.backend_service.service_name
}

output "frontend_ecs_service_name" {
  value = module.frontend_service.service_name
}