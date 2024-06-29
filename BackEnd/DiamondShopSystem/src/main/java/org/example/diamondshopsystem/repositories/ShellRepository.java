package org.example.diamondshopsystem.repositories;

import org.example.diamondshopsystem.entities.Shell;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShellRepository  extends JpaRepository<Shell,Integer> {
    @Query("SELECT s FROM Shell s WHERE s.shellName LIKE %:name%")
    List<Shell> findAllByShellName(@Param("name") String name);

}
