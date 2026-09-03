package com.example.store.conveniencestore.Repository;

import com.example.store.conveniencestore.Domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findRoleByName(String name);
    Role findRoleById(long id);
}
