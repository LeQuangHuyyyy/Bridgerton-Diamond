package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.services.imp.PromotionServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@EnableScheduling
public class ScheduledService {
    @Autowired
    PromotionServiceImp promotionServiceImp;

    @Scheduled(fixedRate = 86400)
    public void runTask() {
        promotionServiceImp.deletePromotion();
    }
}
