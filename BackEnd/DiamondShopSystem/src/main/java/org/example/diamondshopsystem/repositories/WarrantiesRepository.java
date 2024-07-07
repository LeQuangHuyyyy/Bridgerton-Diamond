package org.example.diamondshopsystem.repositories;

import org.example.diamondshopsystem.entities.Warranties;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WarrantiesRepository extends JpaRepository<Warranties, Integer> {
}
