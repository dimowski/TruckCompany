package com.truckcompany.repository;

import com.truckcompany.domain.Company;
import com.truckcompany.domain.Offer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by Viktor Dobroselsky on 01.11.2016.
 */

public interface OfferRepository extends JpaRepository<Offer, Long> {
    Page<Offer> findByCompany(Company company, Pageable pageable);
}
