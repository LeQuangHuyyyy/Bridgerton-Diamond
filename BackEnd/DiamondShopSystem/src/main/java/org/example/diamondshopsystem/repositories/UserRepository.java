package org.example.diamondshopsystem.repositories;

import org.example.diamondshopsystem.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);

    User findByName(String username);

    @Query("SELECT u FROM User u WHERE u.email LIKE %:keyWord% OR u.name LIKE %:keyWord% OR u.phoneNumber LIKE %:keyWord% ")
    List<User> getUserByKeyWord(String keyWord);
}
